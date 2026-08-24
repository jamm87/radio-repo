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

  // Clave de orden por defecto: no es una columna, es un ranking por banda.
  // Ordenar por MHz ascendente enterraba lo que casi todo el mundo busca
  // (VHF/UHF de radioaficion, banda aerea) bajo 150 entradas de LF/VLF.
  var REL = "__rel";

  function buildSuggestions(items, config) {
    var suggestions = [];
    var seen = new Set();

    // Collect unique names
    items.forEach(function (item) {
      var name = config.label(item);
      var key = norm(name);
      if (name && !seen.has(key)) {
        seen.add(key);
        suggestions.push({ text: name, type: "name", key: key });
      }
    });

    // Collect unique categories (first select field is usually category)
    if (config.selects && config.selects.length > 0) {
      var categoryField = config.selects[0].field;
      var categorySeen = new Set();
      items.forEach(function (item) {
        var cat = item[categoryField];
        if (cat && !categorySeen.has(cat)) {
          categorySeen.add(cat);
          suggestions.push({ text: cat, type: "category", key: norm(cat) });
        }
      });
    }

    // Collect unique bands (second select field is usually band)
    if (config.selects && config.selects.length > 1) {
      var bandField = config.selects[1].field;
      var bandSeen = new Set();
      items.forEach(function (item) {
        var band = item[bandField];
        if (band && !bandSeen.has(band)) {
          bandSeen.add(band);
          suggestions.push({ text: band, type: "band", key: norm(band) });
        }
      });
    }

    return suggestions;
  }

  function filterSuggestions(query, suggestions, limit) {
    if (!query) return [];
    var filtered = suggestions.filter(function (s) {
      return s.key.indexOf(query) !== -1;
    });
    return filtered.slice(0, limit || 8);
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
      sort: { key: REL, dir: 1 },
      filters: {},
      onlyVerified: false,
      onlySelected: false,
      suggestionIndex: [],
      suggestionShown: [],
      suggestionFocused: -1,
    };

    var mapApi = createMap($(".js-map"));
    var searchEl = $(".js-search");
    var suggestionsEl = $(".js-suggestions");
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
      if (state.sort.key === REL) {
        var rank = config.relevance || function () { return 0; };
        return rows.slice().sort(function (a, b) {
          return (rank(a) - rank(b)) || ((a.f == null ? Infinity : a.f) - (b.f == null ? Infinity : b.f));
        });
      }
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
          '<tr><td colspan="' + (config.columns.length + 1) + '">' + emptyStateHtml() + "</td></tr>";
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
      announceCount(state.filtered.length);
      updateSelectionInfo();
      updateFilterChips();
      syncSortIndicators();
      syncUrl();
    }

    /*
      El contador visible se actualiza en cada tecla, pero anunciarlo igual de
      rapido convierte la region viva en ruido. Se anuncia cuando el usuario
      deja de escribir: el lector dice "312 resultados" una vez, no una por
      pulsacion.
    */
    var announceCount = debounce(function (total) {
      var live = $(".js-count-live");
      if (live) live.textContent = total + (total === 1 ? " resultado" : " resultados");
    }, 500);

    function syncSortIndicators() {
      root.querySelectorAll("th[data-sort]").forEach(function (th) {
        var on = th.dataset.sort === state.sort.key;
        th.setAttribute("aria-sort", on ? (state.sort.dir === 1 ? "ascending" : "descending") : "none");
        var button = th.querySelector("[data-sort-btn]");
        if (button) button.classList.toggle("is-sorted", on);
        var dir = th.querySelector(".datatable__dir");
        if (dir) dir.textContent = on ? (state.sort.dir === 1 ? "▲" : "▼") : "";
      });

      // Con el orden por relevancia no hay columna activa, asi que la tabla
      // por si sola no puede decir como esta ordenada: se dice aqui.
      var note = $(".js-sortnote");
      if (!note) return;
      if (state.sort.key === REL) {
        note.textContent = "· orden: relevancia";
      } else {
        var column = config.columns.find(function (c) {
          return c.field === state.sort.key;
        });
        note.textContent = "· orden: " + (column ? column.label : state.sort.key) +
          (state.sort.dir === 1 ? " ascendente" : " descendente");
      }
    }

    /*
      "Sin resultados para este filtro" deja al usuario adivinando cual de los
      cuatro filtros tiene la culpa. Aqui se nombran los activos y se ofrece
      quitarlos uno a uno, que es la salida que hace falta.
    */
    function emptyStateHtml() {
      var active = [];
      if (state.filters.q) {
        active.push({ kind: "q", label: "búsqueda", value: searchEl ? searchEl.value.trim() : state.filters.q });
      }
      config.selects.forEach(function (select) {
        if (state.filters[select.field]) {
          active.push({
            kind: "select",
            field: select.field,
            label: select.label.split(":")[0],
            value: state.filters[select.field],
          });
        }
      });
      if (state.onlyVerified) active.push({ kind: "verified", label: "solo verificadas", value: "" });
      if (state.onlySelected) active.push({ kind: "selected", label: "solo seleccionadas", value: "" });

      if (!active.length) return '<div class="empty-state">No hay datos que mostrar.</div>';

      var described = active.map(function (item) {
        return item.value ? esc(item.label) + " «" + esc(item.value) + "»" : esc(item.label);
      });
      var buttons = active.map(function (item) {
        var attr = item.kind === "select"
          ? ' data-clear-field="' + esc(item.field) + '"'
          : ' data-clear="' + esc(item.kind) + '"';
        return '<button class="chip js-clear-one" type="button"' + attr + ">Quitar " + esc(item.label) + "</button>";
      });
      if (active.length > 1) buttons.push('<button class="chip js-reset" type="button">Limpiar todo</button>');

      return '<div class="empty-state"><p>Sin resultados con ' + described.join(" + ") + ".</p>" +
        '<div class="chips empty-state__actions">' + buttons.join("") + "</div></div>";
    }

    function clearFilter(kind, field) {
      if (kind === "select") {
        state.filters[field] = "";
        var select = root.querySelector('[data-field="' + field + '"]');
        if (select) select.value = "";
      } else if (kind === "q") {
        state.filters.q = "";
        if (searchEl) searchEl.value = "";
        hideSuggestions();
      } else if (kind === "verified") {
        state.onlyVerified = false;
        var verified = $(".js-verified");
        if (verified) verified.setAttribute("aria-pressed", "false");
      } else if (kind === "selected") {
        state.onlySelected = false;
        var onlySelected = $(".js-only-selected");
        if (onlySelected) onlySelected.setAttribute("aria-pressed", "false");
      }
      render();
    }

    function resetAll() {
      state.filters = {};
      state.onlyVerified = false;
      state.onlySelected = false;
      state.sort = { key: REL, dir: 1 };
      if (searchEl) searchEl.value = "";
      hideSuggestions();
      root.querySelectorAll("select[data-field]").forEach(function (el) {
        el.value = "";
      });
      root.querySelectorAll('[aria-pressed="true"]').forEach(function (el) {
        if (el.classList.contains("tint-swatch")) return;
        el.setAttribute("aria-pressed", "false");
      });
      render();
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
        if (selectable.length > 0) {
          toggleAll.title = state.selected.size + " de " + selectable.length + " seleccionados";
        }
      }
    }

    function updateFilterChips() {
      var filterChipsEl = $(".js-filter-chips");
      if (!filterChipsEl) return;

      var activeFilters = [];
      config.selects.forEach(function (select) {
        var value = state.filters[select.field];
        if (value) {
          activeFilters.push({ field: select.field, label: select.label, value: value });
        }
      });

      if (activeFilters.length === 0) {
        filterChipsEl.style.display = "none";
        filterChipsEl.innerHTML = "";
        return;
      }

      filterChipsEl.style.display = "flex";
      var html = activeFilters.map(function (filter) {
        return '<span class="filter-chip">' +
          esc(filter.value) +
          '<button class="filter-chip__remove" data-field="' + esc(filter.field) + '" aria-label="Eliminar filtro ' + esc(filter.value) + '">×</button>' +
          '</span>';
      }).join("");

      filterChipsEl.innerHTML = html;

      filterChipsEl.querySelectorAll(".filter-chip__remove").forEach(function (btn) {
        btn.addEventListener("click", function () {
          var field = btn.dataset.field;
          state.filters[field] = "";
          var select = root.querySelector('[data-field="' + field + '"]');
          if (select) select.value = "";
          render();
        });
      });
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
        if (searchEl) searchEl.value = params.get("q");
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

    /*
      El foco nunca sale del input: el lector de pantalla sigue la opcion
      resaltada por aria-activedescendant. Sin ese atributo, mover las flechas
      cambiaba el resaltado visual y no anunciaba nada, con el agravante de que
      la lista si declara role="listbox" y por tanto se anuncia como existente.
    */
    function updateSuggestionFocus(items) {
      items.forEach(function (item, index) {
        var on = index === state.suggestionFocused;
        item.classList.toggle("focused", on);
        item.setAttribute("aria-selected", String(on));
        if (on) item.scrollIntoView({ block: "nearest" });
      });
      if (!searchEl) return;
      var current = items[state.suggestionFocused];
      if (current) searchEl.setAttribute("aria-activedescendant", current.id);
      else searchEl.removeAttribute("aria-activedescendant");
    }

    var SUGGESTION_TYPES = {
      name: { icon: "◯", label: "nombre" },
      category: { icon: "◆", label: "categoría" },
      band: { icon: "■", label: "banda" },
    };

    function showSuggestions(suggestions) {
      if (!suggestionsEl) return;
      if (!suggestions || !suggestions.length) {
        hideSuggestions();
        return;
      }

      suggestionsEl.innerHTML = suggestions
        .map(function (suggestion, index) {
          var type = SUGGESTION_TYPES[suggestion.type] || SUGGESTION_TYPES.name;
          return '<div class="js-suggestion-item" role="option" aria-selected="false" id="sug-' +
            index + '" data-index="' + index + '">' +
            '<span class="suggestion-icon" aria-hidden="true">' + type.icon + "</span>" +
            '<span class="suggestion-text">' + esc(suggestion.text) + "</span>" +
            '<span class="suggestion-type">' + type.label + "</span>" +
            "</div>";
        })
        .join("");

      suggestionsEl.style.display = "block";
      state.suggestionShown = suggestions;
      state.suggestionFocused = -1;
      if (searchEl) {
        searchEl.setAttribute("aria-expanded", "true");
        searchEl.removeAttribute("aria-activedescendant");
      }

      suggestionsEl.querySelectorAll(".js-suggestion-item").forEach(function (item) {
        // mousedown + preventDefault mantiene el foco en el input, asi que el
        // click llega antes de que focusout cierre la lista. Sustituye al
        // temporizador sobre blur, fragil por los dos lados: corto perdia el
        // click, largo dejaba la lista colgada.
        item.addEventListener("mousedown", function (event) {
          event.preventDefault();
        });
        item.addEventListener("click", function () {
          var chosen = state.suggestionShown[Number(item.dataset.index)];
          if (chosen) selectSuggestion(chosen);
        });
      });
    }

    function selectSuggestion(suggestion) {
      if (searchEl) searchEl.value = suggestion.text;
      state.filters.q = norm(suggestion.text);
      hideSuggestions();
      render();
    }

    function hideSuggestions() {
      if (suggestionsEl) suggestionsEl.style.display = "none";
      state.suggestionShown = [];
      state.suggestionFocused = -1;
      if (searchEl) {
        searchEl.setAttribute("aria-expanded", "false");
        searchEl.removeAttribute("aria-activedescendant");
      }
    }

    function suggestionsOpen() {
      return !!suggestionsEl && suggestionsEl.style.display !== "none" && state.suggestionShown.length > 0;
    }

    function bind() {
      if (searchEl) {
        var runSearch = debounce(function () {
          var query = norm(searchEl.value.trim());
          state.filters.q = query;
          if (query && state.suggestionIndex.length) showSuggestions(filterSuggestions(query, state.suggestionIndex));
          else hideSuggestions();
          render();
        }, 120);

        searchEl.addEventListener("input", runSearch);

        searchEl.addEventListener("keydown", function (event) {
          if (!suggestionsOpen()) {
            // Sin lista abierta, Escape limpia la busqueda: es el gesto que ya
            // se espera de un campo de tipo search.
            if (event.key === "Escape" && searchEl.value) {
              event.preventDefault();
              clearFilter("q");
            }
            return;
          }

          var items = suggestionsEl.querySelectorAll(".js-suggestion-item");
          if (event.key === "ArrowDown") {
            event.preventDefault();
            state.suggestionFocused = Math.min(state.suggestionFocused + 1, items.length - 1);
            updateSuggestionFocus(items);
          } else if (event.key === "ArrowUp") {
            event.preventDefault();
            state.suggestionFocused = Math.max(state.suggestionFocused - 1, -1);
            updateSuggestionFocus(items);
          } else if (event.key === "Enter") {
            // Sin nada resaltado, Enter busca lo escrito en vez de elegir la
            // primera sugerencia: robar el Enter sorprende al usuario.
            event.preventDefault();
            var chosen = state.suggestionShown[state.suggestionFocused];
            if (chosen) selectSuggestion(chosen);
            else hideSuggestions();
          } else if (event.key === "Escape") {
            event.preventDefault();
            hideSuggestions();
          }
        });

        searchEl.addEventListener("focus", function () {
          var query = norm(searchEl.value.trim());
          if (query && state.suggestionIndex.length) showSuggestions(filterSuggestions(query, state.suggestionIndex));
        });

        var wrapper = $(".search-input-wrapper");
        if (wrapper) {
          wrapper.addEventListener("focusout", function (event) {
            if (!wrapper.contains(event.relatedTarget)) hideSuggestions();
          });
          document.addEventListener("mousedown", function (event) {
            if (!wrapper.contains(event.target)) hideSuggestions();
          });
        }
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

      // La cabecera ordenable es un <button> dentro del <th>. Antes el
      // manejador colgaba del propio <th>, que no recibe foco: ordenar la
      // tabla era imposible sin raton. El aria-sort sigue en el <th>, que es
      // donde lo espera la especificacion, y lo sincroniza syncSortIndicators.
      root.querySelectorAll("[data-sort-btn]").forEach(function (button) {
        button.addEventListener("click", function () {
          var field = button.dataset.sortBtn;
          if (state.sort.key === field) state.sort.dir *= -1;
          else state.sort = { key: field, dir: 1 };
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

      // Delegado en vez de enlazado al boton: el estado vacio pinta sus
      // propios botones de limpiar mucho despues de que bind() haya corrido.
      root.addEventListener("click", function (event) {
        var target = event.target.closest ? event.target.closest(".js-reset, .js-clear-one") : null;
        if (!target) return;
        if (target.classList.contains("js-reset")) resetAll();
        else clearFilter(target.dataset.clearField ? "select" : target.dataset.clear, target.dataset.clearField);
      });

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
          container.innerHTML = '<div class="map-loading" role="status">Cargando mapa…</div>';
          mapApi
            .ensure()
            .then(function () {
              container.innerHTML = "";
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
        state.suggestionIndex = buildSuggestions(state.items, config);
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
