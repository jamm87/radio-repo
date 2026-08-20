// explorador.js — motor de las paginas de datos (frecuencias y repetidores):
// carga el JSON generado por el build, filtra, ordena, pinta la tabla,
// selecciona filas, exporta a CHIRP y dibuja el mapa bajo demanda.

(function () {
  var RADIO = (window.RADIO = window.RADIO || {});

  // ------------------------------------------------------------- utilidades

  var ESCAPES = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
  function esc(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (m) {
      return ESCAPES[m];
    });
  }

  function norm(value) {
    return String(value == null ? "" : value)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  }

  function fmtMhz(value) {
    if (value == null) return "—";
    var decimals = String(value).split(".")[1];
    var places = decimals && decimals.length > 3 ? (decimals.length > 5 ? 6 : 5) : 3;
    return value.toFixed(places);
  }

  function debounce(fn, wait) {
    var timer;
    return function () {
      var args = arguments;
      clearTimeout(timer);
      timer = setTimeout(function () {
        fn.apply(null, args);
      }, wait);
    };
  }

  function fillSelect(select, values, label) {
    if (!select) return;
    var options = ['<option value="">' + esc(label) + "</option>"];
    values.forEach(function (value) {
      options.push("<option>" + esc(value) + "</option>");
    });
    select.innerHTML = options.join("");
  }

  function download(filename, text) {
    var blob = new Blob([text], { type: "text/csv;charset=utf-8" });
    var url = URL.createObjectURL(blob);
    var link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(function () {
      URL.revokeObjectURL(url);
    }, 1000);
  }

  // ------------------------------------------------------------------ CHIRP

  var CHIRP_HEAD =
    "Location,Name,Frequency,Duplex,Offset,Tone,rToneFreq,cToneFreq,DtcsCode,DtcsPolarity,Mode,TStep,Skip,Comment,URCALL,RPT1CALL,RPT2CALL,DVCODE";

  function chirpName(value) {
    return norm(value)
      .toUpperCase()
      .replace(/[^A-Z0-9 /-]/g, "")
      .trim()
      .slice(0, 12);
  }

  function chirpComment(value) {
    return String(value == null ? "" : value).replace(/["\n\r,]/g, " ").trim().slice(0, 60);
  }

  /** Convierte "-600 kHz" o "-7.6 MHz" en {duplex, offset} de CHIRP. */
  function parseShift(shift) {
    var match = String(shift || "").match(/([+-])?\s*([\d.,]+)\s*(kHz|MHz)/i);
    if (!match) return { duplex: "", offset: "0.000000" };
    var value = parseFloat(match[2].replace(",", "."));
    if (isNaN(value)) return { duplex: "", offset: "0.000000" };
    if (/kHz/i.test(match[3])) value = value / 1000;
    return { duplex: match[1] === "+" ? "+" : "-", offset: value.toFixed(6) };
  }

  function chirpRows(rows) {
    var lines = [CHIRP_HEAD];
    rows.forEach(function (row, index) {
      var mode = row.mode === "Digital" || !row.mode ? "NFM" : row.mode;
      if (mode !== "AM" && mode !== "FM" && mode !== "NFM" && mode !== "WFM") mode = "NFM";
      var step = mode === "AM" ? "25.00" : "12.50";
      var tone = row.ctcss ? "Tone" : "";
      var ctcss = row.ctcss ? parseFloat(row.ctcss).toFixed(1) : "88.5";
      lines.push(
        [
          index,
          chirpName(row.name),
          Number(row.freq).toFixed(6),
          row.duplex || "",
          row.offset || "0.000000",
          tone,
          ctcss,
          ctcss,
          "023",
          "NN",
          mode,
          step,
          "",
          chirpComment(row.comment),
          "",
          "",
          "",
          "",
        ].join(",")
      );
    });
    return lines.join("\n");
  }

  // -------------------------------------------------------------------- mapa

  var CATEGORY_COLORS = {
    "Aeronáutica": "#6cb6ff",
    Radioaficionados: "#c7a6ff",
    "Marítima": "#6fd5d0",
    "PMR446 y uso libre": "#7fe08a",
    "Medios y radiodifusión": "#ffb454",
    Transporte: "#ff9e64",
    "Servicios y utilidad": "#e4f221",
    Emergencias: "#ff7b72",
    Repetidor: "#7fe08a",
    Baliza: "#ffb454",
  };

  var leafletPromise = null;
  function loadLeaflet() {
    if (window.L) return Promise.resolve(window.L);
    if (leafletPromise) return leafletPromise;
    leafletPromise = new Promise(function (resolve, reject) {
      var css = document.createElement("link");
      css.rel = "stylesheet";
      css.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(css);
      var script = document.createElement("script");
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.onload = function () {
        resolve(window.L);
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
    return leafletPromise;
  }

  function createMap(container) {
    var state = { map: null, layer: null, tiles: null };

    function tileUrl() {
      var theme = RADIO.currentTheme ? RADIO.currentTheme() : "dark";
      var style = theme === "light" ? "light_all" : "dark_all";
      return "https://{s}.basemaps.cartocdn.com/" + style + "/{z}/{x}/{y}{r}.png";
    }

    function setTiles() {
      if (!state.map) return;
      if (state.tiles) state.map.removeLayer(state.tiles);
      state.tiles = window.L.tileLayer(tileUrl(), {
        attribution: '&copy; OpenStreetMap, &copy; CARTO',
        maxZoom: 18,
      }).addTo(state.map);
    }

    document.addEventListener("radio:theme", setTiles);

    return {
      ensure: function () {
        return loadLeaflet().then(function () {
          if (!state.map) {
            state.map = window.L.map(container, { scrollWheelZoom: false }).setView([40.2, -3.7], 6);
            setTiles();
          }
          return state.map;
        });
      },
      draw: function (points, focus) {
        if (!state.map) return;
        if (state.layer) state.map.removeLayer(state.layer);
        state.layer = window.L.layerGroup().addTo(state.map);
        points.forEach(function (point) {
          window.L
            .circleMarker([point.lat, point.lng], {
              radius: 5,
              color: CATEGORY_COLORS[point.group] || "#e4f221",
              weight: 2,
              fillOpacity: 0.55,
            })
            .bindPopup(point.popup)
            .addTo(state.layer);
        });
        if (focus && focus.lat != null) state.map.setView([focus.lat, focus.lng], 11);
        else if (points.length) state.map.fitBounds(points.map(function (p) { return [p.lat, p.lng]; }), { padding: [24, 24] });
        setTimeout(function () {
          state.map.invalidateSize();
        }, 60);
      },
    };
  }

  // -------------------------------------------------------------- explorador

  /**
   * Monta un explorador de tabla sobre un contenedor que ya trae en el HTML
   * los controles (buscador, selectores, chips) y los huecos de salida.
   */
  function mount(rootId, config) {
    var root = document.getElementById(rootId);
    if (!root) return;

    var $ = function (selector) {
      return root.querySelector(selector);
    };

    var state = {
      items: [],
      filtered: [],
      selected: new Set(),
      sort: { key: "f", dir: 1 },
      filters: {},
      onlyVerified: false,
      onlySelected: false,
    };

    var mapApi = createMap($(".js-map"));
    var statusEl = $(".js-status");
    var bodyEl = $(".js-tbody");
    var countEl = $(".js-count");
    var selectedEl = $(".js-selected");

    function key(item) {
      return config.key(item);
    }

    function matches(item) {
      var query = state.filters.q;
      if (query) {
        if (norm(config.haystack(item)).indexOf(query) === -1) return false;
      }
      for (var i = 0; i < config.selects.length; i++) {
        var select = config.selects[i];
        var value = state.filters[select.field];
        if (value && String(item[select.field] || "") !== value) return false;
      }
      if (state.onlyVerified && !config.isVerified(item)) return false;
      if (state.onlySelected && !state.selected.has(key(item))) return false;
      return true;
    }

    function applySort(rows) {
      var column = config.columns.find(function (c) {
        return c.field === state.sort.key;
      });
      var numeric = column && column.numeric;
      return rows.slice().sort(function (a, b) {
        var av = a[state.sort.key];
        var bv = b[state.sort.key];
        if (numeric) return ((av == null ? Infinity : av) - (bv == null ? Infinity : bv)) * state.sort.dir;
        return String(av || "").localeCompare(String(bv || ""), "es") * state.sort.dir;
      });
    }

    function render() {
      state.filtered = applySort(state.items.filter(matches));

      if (!state.filtered.length) {
        bodyEl.innerHTML =
          '<tr><td colspan="' + (config.columns.length + 1) + '"><div class="empty-state">Sin resultados para este filtro.</div></td></tr>';
      } else {
        var html = new Array(state.filtered.length);
        for (var i = 0; i < state.filtered.length; i++) {
          var item = state.filtered[i];
          var itemKey = key(item);
          var cells = ['<td><label class="sacred-checkbox"><input type="checkbox" class="js-row" data-key="' +
            esc(itemKey) + '"' + (state.selected.has(itemKey) ? " checked" : "") +
            ' aria-label="Seleccionar ' + esc(config.label(item)) + '"><span class="sacred-checkbox__figure" aria-hidden="true"></span></label></td>'];
          for (var c = 0; c < config.columns.length; c++) {
            var column = config.columns[c];
            cells.push('<td class="' + (column.cellClass || "") + '">' + column.render(item) + "</td>");
          }
          html[i] = "<tr>" + cells.join("") + "</tr>";
        }
        bodyEl.innerHTML = html.join("");
      }

      if (countEl) countEl.textContent = String(state.filtered.length);
      updateSelectionInfo();
      syncUrl();
    }

    function updateSelectionInfo() {
      if (selectedEl) selectedEl.textContent = String(state.selected.size);
      var toggleAll = $(".js-select-all");
      if (toggleAll) {
        var selectable = state.filtered.filter(function (item) {
          return item.f != null;
        });
        toggleAll.checked = selectable.length > 0 && selectable.every(function (item) {
          return state.selected.has(key(item));
        });
      }
    }

    function syncUrl() {
      if (!window.history || !window.history.replaceState) return;
      var params = new URLSearchParams();
      if (state.filters.q) params.set("q", state.filters.q);
      config.selects.forEach(function (select) {
        if (state.filters[select.field]) params.set(select.field, state.filters[select.field]);
      });
      if (state.onlyVerified) params.set("v", "1");
      var query = params.toString();
      window.history.replaceState(null, "", query ? "?" + query : window.location.pathname);
    }

    function readUrl() {
      var params = new URLSearchParams(window.location.search);
      if (params.get("q")) {
        state.filters.q = norm(params.get("q"));
        var search = $(".js-search");
        if (search) search.value = params.get("q");
      }
      config.selects.forEach(function (select) {
        var value = params.get(select.field);
        if (value) state.filters[select.field] = value;
      });
      state.onlyVerified = params.get("v") === "1";
    }

    function selectionRows() {
      return state.items.filter(function (item) {
        return item.f != null && state.selected.has(key(item));
      });
    }

    function bind() {
      var search = $(".js-search");
      if (search) {
        search.addEventListener(
          "input",
          debounce(function () {
            state.filters.q = norm(search.value.trim());
            render();
          }, 120)
        );
      }

      config.selects.forEach(function (select) {
        var el = $('[data-field="' + select.field + '"]');
        if (!el) return;
        fillSelect(el, config.facets[select.field] || [], select.label);
        if (state.filters[select.field]) el.value = state.filters[select.field];
        el.addEventListener("change", function () {
          state.filters[select.field] = el.value;
          render();
        });
      });

      root.addEventListener("change", function (event) {
        var target = event.target;
        if (target.classList.contains("js-row")) {
          if (target.checked) state.selected.add(target.dataset.key);
          else state.selected.delete(target.dataset.key);
          updateSelectionInfo();
        }
        if (target.classList.contains("js-select-all")) {
          state.filtered.forEach(function (item) {
            if (item.f == null) return;
            if (target.checked) state.selected.add(key(item));
            else state.selected.delete(key(item));
          });
          render();
        }
      });

      root.querySelectorAll("[data-sort]").forEach(function (th) {
        th.addEventListener("click", function () {
          var field = th.dataset.sort;
          if (state.sort.key === field) state.sort.dir *= -1;
          else state.sort = { key: field, dir: 1 };
          root.querySelectorAll("[data-sort]").forEach(function (other) {
            other.setAttribute("aria-sort", "none");
          });
          th.setAttribute("aria-sort", state.sort.dir === 1 ? "ascending" : "descending");
          render();
        });
      });

      var verified = $(".js-verified");
      if (verified) {
        verified.setAttribute("aria-pressed", String(state.onlyVerified));
        verified.addEventListener("click", function () {
          state.onlyVerified = !state.onlyVerified;
          verified.setAttribute("aria-pressed", String(state.onlyVerified));
          render();
        });
      }

      var onlySelected = $(".js-only-selected");
      if (onlySelected) {
        onlySelected.addEventListener("click", function () {
          state.onlySelected = !state.onlySelected;
          onlySelected.setAttribute("aria-pressed", String(state.onlySelected));
          render();
        });
      }

      var reset = $(".js-reset");
      if (reset) {
        reset.addEventListener("click", function () {
          state.filters = {};
          state.onlyVerified = false;
          state.onlySelected = false;
          if (search) search.value = "";
          root.querySelectorAll("select[data-field]").forEach(function (el) {
            el.value = "";
          });
          root.querySelectorAll('[aria-pressed="true"]').forEach(function (el) {
            if (el.classList.contains("tint-swatch")) return;
            el.setAttribute("aria-pressed", "false");
          });
          render();
        });
      }

      root.querySelectorAll("[data-preset]").forEach(function (btn) {
        btn.addEventListener("click", function () {
          config.presets(btn.dataset.preset, state, render);
        });
      });

      var csvButton = $(".js-csv");
      if (csvButton) {
        csvButton.addEventListener("click", function () {
          var rows = selectionRows();
          if (!rows.length) {
            window.alert("No hay nada seleccionado. Marca filas o usa un preset.");
            return;
          }
          download(config.csvName, chirpRows(rows.map(config.toChirp)));
        });
      }

      var previewButton = $(".js-preview");
      if (previewButton) {
        previewButton.addEventListener("click", function () {
          var preview = $(".js-csv-preview");
          var rows = selectionRows();
          preview.textContent = rows.length ? chirpRows(rows.map(config.toChirp)) : "(sin selección)";
          preview.classList.toggle("show");
        });
      }

      var mapButton = $(".js-map-toggle");
      if (mapButton) {
        mapButton.addEventListener("click", function () {
          var container = $(".js-map");
          var open = container.classList.toggle("open");
          mapButton.setAttribute("aria-pressed", String(open));
          container.setAttribute("aria-hidden", String(!open));
          if (!open) return;
          mapApi
            .ensure()
            .then(function () {
              mapApi.draw(
                state.filtered
                  .filter(function (item) {
                    return item.lat != null;
                  })
                  .map(config.toPoint)
              );
            })
            .catch(function () {
              // Leaflet se carga desde CDN; sin red el mapa no puede montarse.
              container.innerHTML =
                '<div class="empty-state">No se ha podido cargar la biblioteca del mapa (Leaflet se descarga de unpkg.com). Comprueba la conexión y vuelve a intentarlo.</div>';
            });
        });
      }
    }

    if (statusEl) statusEl.textContent = "Cargando datos…";

    fetch(config.src)
      .then(function (response) {
        if (!response.ok) throw new Error("HTTP " + response.status);
        return response.json();
      })
      .then(function (payload) {
        state.items = config.extract(payload);
        config.facets = payload.facetas || {};
        readUrl();
        bind();
        if (statusEl) statusEl.textContent = "";
        render();
      })
      .catch(function (error) {
        if (statusEl) {
          statusEl.innerHTML =
            '<span class="mono-dim">No se pudieron cargar los datos (' +
            esc(error.message) +
            "). Si has abierto el fichero directamente desde disco, sirve la carpeta con <code>npm run dev</code>.</span>";
        }
      });
  }

  RADIO.explorer = { mount: mount, esc: esc, fmtMhz: fmtMhz, norm: norm, parseShift: parseShift, chirpRows: chirpRows, download: download };
})();
