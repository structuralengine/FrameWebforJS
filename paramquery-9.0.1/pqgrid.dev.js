/*!
 * ParamQuery Pro v9.0.1
 * 
 * Copyright (c) 2012-2023 Paramvir Dhindsa (http://paramquery.com)
 * Released under Commercial license
 * http://paramquery.com/pro/license
 * 
 */
var jQuery, pq, JSZip, jQuery, pq, JSZip;
"function" == typeof require ? (jQuery = require("jquery-ui-pack"), pq = {}, JSZip = require("jszip"), module.exports = pq) : (jQuery = window.jQuery, pq = window.pq = window.pq || {}, JSZip = window.JSZip), pq.mixin = {
	render: {
		getRenderVal: function(t, e, n) {
			var i = t.column.exportRender;
			return e && !1 !== i || i ? n.renderCell(t) : [t.rowData[t.dataIndx], ""]
		},
		getTitle: function(t, e) {
			var n = t.title;
			return null != n ? pq.isFn(n) && (n = n.call(this.that, {
				colIndx: e,
				column: t,
				dataIndx: t.dataIndx,
				Export: !0
			})) : n = "", n
		}
	},
	GrpTree: {
		buildCache: function() {
			for (var t, e, n = this, i = n.that.options, r = n.isTree, o = r ? i.dataModel.data : n.that.pdata, a = n.cache = {}, l = n.id, s = 0, d = o.length; s < d; s++)
				if (t = o[s], r || t.pq_gtitle) {
					if (null == (e = t[l])) throw "unknown id of row";
					a[e] = t
				}
		},
		cascadeInit: function() {
			if (this.getCascadeInit()) {
				for (var t, e = this, n = [], i = e.cbId, r = e.that, o = e.Model.select, a = r.pdata, l = 0, s = a.length; l < s; l++)(t = a[l])[i] ? e.isEditable(t) ? (n.push(t), delete t[i]) : o && (t.pq_rowselect = !0) : null === t[i] && delete t[i];
				n.length && e.checkNodes(n, null, null, !0)
			}
		},
		cascadeNest: function(t) {
			for (var e, n, i, r = this, o = r.cbId, a = r.prop, l = r.childstr, s = t.length, d = 0; d < s; d++)(n = t[d])[a] && (e = !0, r.eachChild(n, r.chkEachChild(o, n[o], a)), delete n[a]), (i = n[l]) && i.length && r.cascadeNest(i);
			e && r.hasParent(n) && r.eachParent(n, r.chkEachParent(o))
		},
		checkAll: function(t, e) {
			var n = this.that;
			return this.checkNodes(n.pdata, t = null == t || t, e, null, !0)
		},
		checkNodes: function(t, e, n, i, r) {
			for (var o, a, l, s = 0, d = t.length, c = [], u = {
					check: e = null == e ? !0 : e
				}, h = this, f = h.that, p = f.riOffset, g = h.cbId, m = h.prop, v = h.Model, w = !r && h.isCascade(v), r = i && v.eventForInit || !i, v = v.select; s < d; s++) o = t[s], this.isEditable(o) && (a = o.pq_ri, c.push({
				rowData: o,
				rowIndx: a,
				rowIndxPage: a - p
			}));
			if (u.rows = c, u.dataIndx = h.colUI.dataIndx, i && (u.init = i), !1 !== (l = r ? f._trigger("beforeCheck", n, u) : l) && (d = (c = u.rows).length)) {
				for (var x = this.chkRows = [], s = 0; s < d; s++) o = c[s].rowData, w && (o[m] = !0), x.push({
					rd: o,
					val: e,
					oldVal: o[g]
				}), o[g] = e;
				w && h.cascadeNest(h.getRoots()), v && this.selectRows(), w && (u.getCascadeList = h.getCascadeList(h)), r && f._trigger("check", n, u), x.length = 0
			}
			h.setValCBox(), i || f.refresh({
				header: !1
			})
		},
		chkEachChild: function(n, i, r) {
			return function(t) {
				var e;
				!this.isEditable(t) || r && t[r] || (e = t[n], null !== i && e !== i && (this.chkRows.push({
					rd: t,
					val: i,
					oldVal: e
				}), t[n] = i))
			}
		},
		chkEachParent: function(d) {
			var c = this.childstr;
			return function(t) {
				if (this.isEditable(t)) {
					for (var e, n, i = t[c], r = 0, o = 0, a = t[d], l = 0, s = i.length; l < s; l++)
						if (n = i[l], this.isEditable(n)) {
							if (n = n[d]) r++;
							else {
								if (null === n) {
									e = null;
									break
								}
								o++
							}
							if (r && o) {
								e = null;
								break
							}
						} a !== (e = void 0 === e ? !!r : e) && (this.chkRows.push({
						rd: t,
						val: e,
						oldVal: a
					}), t[d] = e)
				}
			}
		},
		eachChild: function(t, e, n) {
			e.call(this, t, n);
			for (var i, r = this.childstr, o = t[r] || [], a = 0, l = o.length; a < l; a++)(i = o[a])[r] ? this.eachChild(i, e, t) : e.call(this, i, t)
		},
		eachParent: function(t, e) {
			for (; t = this.getParent(t);) e.call(this, t)
		},
		_flatten: function(t, e, n, i) {
			for (var r, o, a = t.length, l = this.id, s = this.parentId, d = 0, c = this.childstr; d < a; d++)(r = t[d]).pq_level = n, i.push(r), e && (r[s] = l ? e[l] : e), (o = r[c]) && this._flatten(o, r, n + 1, i)
		},
		flatten: function(t) {
			var e = [];
			return this._flatten(t, null, 0, e), e
		},
		getUniqueNodes: function(t) {
			var e = [],
				n = {},
				i = this.parentId,
				r = this.id;
			return t.forEach(function(t) {
				null != t[r] && (n[t[r]] = 1)
			}), t.forEach(function(t) {
				n[t[i]] || e.push(t)
			}), e
		},
		getCascadeInit: function() {
			var t = this._cascadeInit;
			return this._cascadeInit = !0, t
		},
		getNode: function(t) {
			return this.cache[t]
		},
		getParent: function(t) {
			t = t[this.parentId];
			return this.cache[t]
		},
		fillState: function(t) {
			var e, n, i = this.childstr,
				r = this.cache;
			for (e in r)(n = r[e])[i] && (t[e] = n.pq_close || !1);
			return t
		},
		hasParent: function(t) {
			return null != t[this.parentId]
		},
		getRoots: function(t) {
			for (var e, n = this.that, i = t || n.pdata || [], r = i.length, o = 0, a = []; o < r; o++) 0 !== (e = i[o]).pq_level || e.pq_gsummary || a.push(e);
			return a = r && !a.length ? i : a
		},
		setCascadeInit: function(t) {
			this._cascadeInit = t
		},
		getCascadeList: function(d) {
			var c = [];
			return function() {
				if (!c.length)
					for (var t = d.chkRows, e = 0, n = d.cbId, i = t.length; e < i; e++) {
						var r = t[e],
							o = r.rd,
							a = o.pq_ri,
							l = {},
							s = {};
						l[n] = r.val, s[n] = r.oldVal, c.push({
							rowIndx: a,
							rowData: o,
							newRow: l,
							oldRow: s
						})
					}
				return c
			}
		},
		getChildren: function(t) {
			return (t ? t[this.childstr] : this.getRoots()) || []
		},
		getChildrenAll: function(t, e) {
			for (var n, i = this.childstr, r = t[i] || [], o = r.length, a = 0, l = e || []; a < o; a++) n = r[a], l.push(n), n[i] && this.getChildrenAll(n, l);
			return l
		},
		getSummary: function(t) {
			return t.pq_child_sum
		},
		isAncestor: function(t, e) {
			for (var n = t; n = this.getParent(n);)
				if (n == e) return !0
		},
		isEmpty: function(t) {
			return !(t[this.childstr] || []).length
		},
		isCascade: function(t) {
			return t.cascade && t.checkbox && !t.maxCheck
		},
		isEditable: function(t) {
			if (t.pq_gsummary) return !1;
			var e = this.that,
				n = this.colCB;
			return !n || !(n = n.editable) || (pq.isFn(n) ? n.call(e, {
				rowData: t
			}) : n)
		},
		isFolder: function(t) {
			return null != t.pq_close || !!t[this.childstr]
		},
		onCheckbox: function(n, i) {
			return function(t, e) {
				i.checkbox && n.colUI == e.column && n.checkNodes([e.rowData], e.input.checked, t)
			}
		},
		onCMInit: function() {
			var t, e, n = this,
				i = n.that,
				r = i.columns,
				o = n.isTree,
				i = i.colModel,
				a = n.Model;
			a.titleInFirstCol && i && (i = i.find(function(t) {
				return !t.hidden
			}), a.titleIndx = i.dataIndx = (null == i.dataIndx ? Math.random() : i.dataIndx).toString()), a.checkbox && r && ((e = r[a.cbId] || {
				dataIndx: a.cbId
			}).cb = {
				check: !0,
				uncheck: !1,
				select: a.select,
				header: a.checkboxHead,
				maxCheck: a.maxCheck
			}, t = o ? r[a.dataIndx] : r[a.titleIndx]), n.colCB = e, n.colUI = t, r && o && n.setCellRender()
		},
		onCustomSortTree: function(t, e) {
			var n = this.getRoots(e.data);
			return this.sort(n, e.sort_composite), e.data = this.flatten(n), !1
		},
		onRefresh: function(t, n) {
			return function() {
				if (n.checkbox)
					for (var t = this.$cont.find(".pq_indeter"), e = t.length; e--;) t[e].indeterminate = !0
			}
		},
		refreshView: function(t) {
			this.that.refreshView({
				header: !1,
				source: t
			})
		},
		renderCB: function(t, e, n) {
			if (e.pq_gsummary) return "";
			var i, r = this.that,
				o = "",
				a = "",
				l = "";
			return (t = pq.isFn(t) ? t.call(r, e) : t) ? (e[n] && (o = "checked"), this.isEditable(e) || (a = "disabled", i = "pq_disable"), ["<input type='checkbox' tabindex='-1' " + (l = null === e[n] ? "class='pq_indeter'" : l) + " " + o + " " + a + "/>", i]) : void 0
		},
		selectRows: function() {
			for (var t = 0, e = this.chkRows, n = e.length; t < n; t++) {
				var i = e[t],
					r = i.rd,
					i = i.val;
				r.pq_rowselect = i
			}
		},
		sort: function(t, e) {
			function a() {
				return pq.isFn(e) ? e : e.shift()
			}
			var l = this.childstr;
			! function t(e, n) {
				var i, r = e.length,
					o = 0;
				if (r)
					for (n && e.sort(n), n = a(); o < r; o++)(i = e[o][l]) && t(i, n)
			}(t, a())
		},
		copyArray: function(t, e) {
			for (var n = 0, i = e.length; n < i; n++) t.push(e[n])
		},
		_summaryT: function(t, e, n, i, r, o, a) {
			for (var l, s, d, c, u, h = this, f = h.childstr, p = h.isGroup, g = h.isTree, m = o.summaryInTitleRow, v = o.showSummary, w = !o.skipSingleSummary, x = o.titleIndx, y = 0, C = t.length, b = 0, I = {}, q = {}, _ = h.id, R = h.parentId, D = p && a ? o.dataIndx[a.pq_level] : "", M = [], T = n.length, S = pq.aggregate; b < T; b++) I[u = n[b]] = [];
			for (; y < C; y++) {
				if (s = t[y], e.push(s), d = s[f]) {
					for (l = h._summaryT(d, e, n, i, r, o, s), b = 0; b < T; b++) u = n[b], h.copyArray(I[u], l[1][u]);
					h.copyArray(M, l[2])
				}
				if (g && (!m || !h.isFolder(s)) || p && !s.pq_gtitle) {
					for (b = 0; b < T; b++) I[u = n[b]].push(s[u]);
					M.push(s)
				}
			}
			for (q.pq_level = a ? a.pq_level : 0, o.grandSummary && (q.pq_grandsummary = !0), a && (g && !m || p && v[a.pq_level]) && (q[R] = a[_], w || 1 < C ? e.push(q) : q.pq_ghidden = !0, (a.pq_child_sum = q).pq_hidden = a.pq_close), b = 0; b < T; b++) u = n[b], c = (c = i[b])[D] || c.type, q[u] = S[c](I[u], r[b], M, q), m && a && u != x && (a[u] = q[u]);
			return q.pq_gsummary = !0, [q, I, M]
		},
		summaryT: function() {
			for (var t, e, n = this, i = n.that, r = i.options, o = n.Model, a = n.getRoots(), l = [], s = [], d = [], c = [], u = 0, h = i.colModel, f = h.length; u < f; u++)(e = (t = h[u]).summary) && e.type && (d.push(t.dataIndx), c.push(t), s.push(e));
			a = n._summaryT(a, l, d, s, c, o)[0], o.grandSummary ? n.summaryData = r.summaryData = [a] : (n.summaryData || []).length = 0, i.pdata = l
		}
	}
}, ! function(e) {
	var t = pq.mixin,
		i = !0;
	e(document).one("pq:ready", function() {
		var t = e("<input type='checkbox' style='position:fixed;left:-50px;top:-50px;'/>").appendTo(document.body);
		t[0].indeterminate = !0, t.on("change", function() {
			i = !1
		}), t.click(), t.remove()
	}), t.ChkGrpTree = {
		onCellKeyDown: function(t, e) {
			var n = this.colUI;
			if (n && e.dataIndx == n.dataIndx && 32 == t.keyCode) return this.that.getCell(e).find("input").click(), !1
		},
		getCheckedNodes: function(t) {
			var e, n = this.that,
				i = t ? n.getData() : n.options.dataModel.data,
				r = i.length,
				o = 0,
				a = [],
				t = this.colCB || {},
				l = (t.cb || {}).check,
				s = t.dataIndx;
			if (null != s)
				for (; o < r; o++)(e = i[o])[s] === l && a.push(e);
			return a
		},
		hasCboxHead: function() {
			return ((this.colCB || {}).cb || {}).header
		},
		isHeadChecked: function() {
			return this.inpVal
		},
		onBeforeCheck: function(t, e) {
			var n, i, r, o, a, l, s;
			e.check && this.colCB && (l = this.colCB, n = l.cb, i = n.select, (r = n.maxCheck) && this.colUI.dataIndx == e.dataIndx && (s = (o = e.rows.slice(0, r)).length, a = l.dataIndx, 0 < (s = s + (l = this.getCheckedNodes(!0)).length - r) && l.slice(0, s).forEach(function(t) {
				t[a] = n.uncheck, i && delete t.pq_rowselect
			}), e.rows = o))
		},
		onHeaderChange: function(t) {
			!1 === this.checkAll(t.target.checked, t) && this.refreshHeadVal()
		},
		onRefreshHeader: function() {
			var e, n = this,
				t = n.that;
			n.hasCboxHead() && ("groupModel" != n.model || t.options[n.model].on) && (t = t.getCellHeader({
				dataIndx: n.colUI.dataIndx
			}), (e = t.find("input")).length || (t.find(".pq-title-span").prepend('<input type="checkbox" tabindex="-1" />'), e = t.find("input")), n.$inp && e[0] == n.$inp[0] || (n.$inp = e, n.refreshHeadVal(), i && e.on("click", function(t) {
				null == e.data("pq_value") && (e[0].checked = !0, e.data("pq_value", !0), n.onHeaderChange(t))
			}), e.on("change", function(t) {
				n.onHeaderChange(t)
			})))
		},
		refreshHeadVal: function() {
			this.$inp && this.$inp.pqval({
				val: this.inpVal
			})
		},
		setValCBox: function() {
			if (this.hasCboxHead()) {
				var t, e = this.that,
					n = e.options,
					i = this.colCB,
					r = i.dataIndx,
					o = e.colIndxs[r],
					a = i.cb,
					l = a.all,
					s = "remote" == n.pageModel.type || !l ? e.riOffset : 0,
					d = l ? n.dataModel.data : e.pdata,
					l = null,
					c = 0,
					u = 0,
					h = 0;
				if (d) {
					for (var f = 0, p = d.length; f < p; f++)(t = d[f]).pq_gsummary || t.pq_gtitle || !this.isEditable(t, i, f + s, o, r) || (u++, t[r] === a.check ? c++ : h++);
					c == u && u ? l = !0 : h == u && (l = !1), this.inpVal = l, this.refreshHeadVal()
				}
			}
		},
		unCheckAll: function() {
			this.checkAll(!1)
		},
		unCheckNodes: function(t, e) {
			this.checkNodes(t, !1, e)
		}
	}
}(jQuery), ! function(f) {
	function p(t, e, n, i) {
		for (var r = e.slice(), o = 0, a = r.length, l = []; o < a; o++) {
			var s = r[o],
				d = s.cb,
				c = s.one;
			if (c) {
				if (s._oncerun) continue;
				s._oncerun = !0
			}
			if (!1 === d.call(t, n, i) && (n.preventDefault(), n.stopPropagation()), c && l.push(o), n.isImmediatePropagationStopped()) break
		}
		if (a = l.length)
			for (o = a - 1; 0 <= o; o--) r.splice(l[o], 1)
	}
	var t = f.paramquery = f.paramquery || {},
		t = (t._trigger = function(t, e, n) {
			var i, r, o = this,
				a = o.listeners,
				l = a[t],
				s = o.options,
				d = s.allEvents,
				c = s.bubble,
				u = o.element,
				h = s[t];
			if (n = n || {}, (e = f.Event(e)).type = o.widgetName + ":" + t, e.target = u[0], r = e.originalEvent)
				for (i in r) i in e || (e[i] = r[i]);
			return d && pq.isFn(d) && d.call(o, e, n), l && l.length && (p(o, l, e, n), e.isImmediatePropagationStopped()) || s.trigger && (u[c ? "trigger" : "triggerHandler"](e, n), e.isImmediatePropagationStopped()) || (h && !1 === h.call(o, e, n) && (e.preventDefault(), e.stopPropagation()), (l = a[t + "Done"]) && l.length && p(o, l, e, n)), !e.isDefaultPrevented()
		}, t.on = function() {
			for (var t, e, n, i, r, o, a, l, s = arguments, d = (i = "boolean" == typeof s[0] ? (t = s[0], e = s[1], n = s[2], s[3]) : (e = s[0], n = s[1], s[2]), e.split(" ")), c = 0; c < d.length; c++) {
				var u = d[c];
				u && (u = u, o = n, a = i, l = t, ((r = this).listeners[u] || (r.listeners[u] = []))[l ? "unshift" : "push"]({
					cb: o,
					one: a
				}))
			}
			return this
		}, t.one = function() {
			for (var t = arguments.length, e = [], n = 0; n < t; n++) e[n] = arguments[n];
			return e[t] = !0, this.on.apply(this, e)
		}, t.off = function(t, e) {
			for (var n = t.split(" "), i = 0; i < n.length; i++) {
				var r = n[i];
				if (r) {
					c = d = s = l = void 0;
					var o = this,
						a = e;
					if (a) {
						var l = o.listeners[r];
						if (l) {
							for (var s = [], d = 0, c = l.length; d < c; d++) a == l[d].cb && s.push(d);
							if (s.length)
								for (d = s.length - 1; 0 <= d; d--) l.splice(s[d], 1)
						}
					} else delete o.listeners[r]
				}
			}
			return this
		}, {
			options: {
				items: ".pq-grid-cell.pq-has-tooltip,.pq-grid-cell[title]",
				position: {
					my: "center top",
					at: "center bottom"
				},
				content: function() {
					var t = f(this),
						e = t.closest(".pq-grid").pqGrid("instance"),
						n = e.getCellIndices({
							$td: t
						}),
						i = n.rowIndx,
						n = n.dataIndx,
						e = e.data({
							rowIndx: i,
							dataIndx: n,
							data: "pq_valid"
						}).data;
					return e ? ("" == (i = e.icon) ? "" : "<span class='ui-icon " + i + " pq-tooltip-icon'></span>") + (n = null != (n = e.msg) ? n : "") : t.attr("title")
				}
			}
		});
	t._create = function() {
		this._super();
		var t = this.element,
			e = this.eventNamespace;
		t.on("pqtooltipopen" + e, function(t, e) {
			var n, i, r = f(t.target),
				t = f(t.originalEvent.target);
			t.on("remove.pqtt", function(t) {
				r.pqTooltip("close", t, !0)
			}), r.is(".pq-grid") && (i = (t = (n = r.pqGrid("instance")).getCellIndices({
				$td: t
			})).rowIndx, t = t.dataIndx, (n = n.getRowData({
				rowIndx: i
			})) && (n = n.pq_celldata) && (n = n[t]) && (n = n.pq_valid) && (t = (i = n).style, n = i.cls, e.tooltip.addClass(n), i = e.tooltip.attr("style"), e.tooltip.attr("style", i + ";" + t)))
		}), t.on("pqtooltipclose" + e, function(t, e) {
			f(t.target);
			f(t.originalEvent.target).off(".pqtt")
		})
	}, f.widget("paramquery.pqTooltip", f.ui.tooltip, t)
}(jQuery), ! function(d) {
	var n, i, r, o, a, l, s, c, u, t = d.paramquery,
		e = Array.prototype,
		f = (e.find || (e.find = function(t, e) {
			for (var n, i = 0, r = this.length; i < r; i++)
				if (n = this[i], t.call(e, n, i, this)) return n
		}), e.findIndex || (e.findIndex = function(t, e) {
			for (var n, i = 0, r = this.length; i < r; i++)
				if (n = this[i], t.call(e, n, i, this)) return i;
			return -1
		}), d.extend(pq, {
			arrayUnique: function(t, e) {
				for (var n, i, r = [], o = t.length, a = {}, l = 0; l < o; l++) n = t[l], 1 != a[i = e ? n[e] : n] && (a[i] = 1, r.push(n));
				return r
			},
			cap1: function(t) {
				return t && t.length ? t[0].toUpperCase() + t.slice(1) : ""
			},
			elementFromXY: function(t) {
				var e, n = t.clientX,
					t = t.clientY,
					i = d(document.elementFromPoint(n, t));
				return i.closest(".ui-draggable-dragging").length && ((e = i).hide(), i = d(document.elementFromPoint(n, t)), e.show()), i
			},
			getFocusEle: function(t, e) {
				var n = ["a", "textarea", "button", "input", "select", "[tabindex]", "div[contenteditable]"].map(function(t) {
						return t + ':not([disabled],[tabindex="-1"])'
					}).join(","),
					i = document.activeElement,
					r = d(i);
				if (e = e || document.body, i) return -1 < (n = -1 == (n = (e = [].filter.call(d(e).find(n), function(t) {
					return (0 < t.offsetWidth || 0 < t.offsetHeight || t == i) && -1 == t.className.indexOf("pq-box-focus")
				})).indexOf(i)) ? e.indexOf(r.closest("[tabindex=0]")[0]) : n) ? t ? e[n - 1] : e[n + 1] : t ? e[e.length - 1] : e[0]
			},
			focusEle: function(t, e) {
				t = this.getFocusEle(t, e);
				return t && d(t).focus(), t
			},
			escapeHtml: function(t) {
				return t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
			},
			excelToJui: (a = {}, function(t) {
				var e = a[t];
				return e || (e = t.replace(/yy/g, "y").replace(/dddd/g, "DD").replace(/ddd/g, "D").replace(/mmmm/g, "MM").replace(/mmm/g, "M"), a[t] = e), e
			}),
			mergeDeep: function(t, e) {
				var n, i, r;
				for (n in e) i = e[n], r = t[n], d.isPlainObject(i) && d.isPlainObject(r) ? pq.mergeDeep(r, i) : t[n] = i
			},
			inherit: function(t, e, n) {
				function i() {}
				i.prototype = t.prototype;
				var r, o = e.prototype = new i,
					a = t.prototype;
				for (r in n) {
					var l = a[r],
						s = n[r];
					o[r] = l ? function(n, i) {
						return function() {
							var t, e = this._super;
							return this._super = function() {
								return n.apply(this, arguments)
							}, t = i.apply(this, arguments), this._super = e, t
						}
					}(l, s) : s
				}
				o.constructor = e, o._base = t, o._bp = function(t) {
					var e = arguments;
					return Array.prototype.shift.call(e), a[t].apply(this, e)
				}
			},
			copyObj: function(t, e, n) {
				var i, r, o = pq.objectify(n);
				for (i in e) o[i] || (r = e[i], t[i] = d.isPlainObject(r) ? d.extend(!0, {}, r) : r);
				return t
			},
			exportCsv: function(t, e, n) {
				var i, r, o = [],
					a = (n = n || {}).separator || ",";

				function l(t) {
					t.forEach(function(t) {
						i = [], t.cells.forEach(function(t) {
							r = ((r = null == (r = t.text) ? "" : r) + "").replace(/\"/g, '""'), i.push('"' + r + '"')
						}), o.push(i.join(a))
					})
				}
				return l(t), l(e), (n.skipBOM ? "" : "\ufeff") + o.join("\n")
			},
			exportHtm: function(t, e, n) {
				var i = n.grid,
					r = i.options.rtl ? "direction:rtl;" : "",
					i = i.element.find(".pq-table"),
					o = i.css("font-family"),
					i = i.css("font-size"),
					a = "td,th{padding: 5px;}" + (n.cssRules || ""),
					o = "empty-cells:show;font-family:" + o + ";font-size:" + i + ";border-spacing:0;" + r + (n.cssTable || ""),
					l = [];

				function s(t, o) {
					o && l.push("<thead>"), t.forEach(function(t) {
						var r, e = [];
						(r = t.attr) && e.push(r), (r = t.css) && e.push("style='" + pq.styleStr(r) + "'"), e = e.length ? " " + e.join(" ") : "", l.push("<tr", e, ">"), t.cells.forEach(function(t) {
							var e, n, i;
							t.empty || (e = t.html || t.text, n = "", i = [], (r = t.colSpan) && i.push("colspan=" + r), (r = t.rowSpan) && i.push("rowspan=" + r), (r = t.alignment) && (n += "text-align:" + r + ";"), (r = t.valign) && (n += "vertical-align:" + ("center" == r ? "middle" : r) + ";"), (r = t.css) && (n += pq.styleStr(r)), n && i.push("style='" + n + "'"), i = i.length ? " " + i.join(" ") : "", o ? l.push("<th", i, ">", e, "</th>") : l.push("<td", i, ">", pq.newLine(e), "</td>"))
						}), l.push("</tr>")
					}), o && l.push("</thead>")
				}
				return l.push("<style>" + a + "</style>"), l.push("<table class='pq-export-table' style='" + o + "'>"), t.length && s(t, !0), s(e), l.push("</table>"), l.join("")
			},
			borderP: ["left", "top", "right", "bottom"],
			getPdfStyle: function(n, i) {
				function t(t, e) {
					null == n[t] && (n[t] = e)
				}
				var r, o;
				(r = i["background-color"]) && t("fillColor", r), (r = i["font-size"]) && t("fontSize", parseFloat(r)), (r = i.color) && t("color", r), (r = i["font-weight"]) && t("bold", "bold" == r), (r = i["white-space"]) && t("noWrap", "nowrap" == r), (r = i["font-style"]) && t("italics", "italic" == r), (r = i["text-decoration"]) && (r = pq.camelCase(r), 0 <= ["underline", "lineThrough", "overline"].indexOf(r) && t("decoration", r)), pq.borderP.forEach(function(t, e) {
					!(r = i["border-" + t]) || (o = n.borderColor = n.borderColor || [])[e] || (o[e] = r.split(" ")[2])
				}), n.border = n.borderColor
			},
			exportPdf: function(t, e) {
				var n, i, r, o, a, l = this,
					s = t.length,
					d = s ? t[0].cells.length : e[0] ? e[0].cells.length : 0,
					c = [];

				function u(t) {
					t.forEach(function(t) {
						for ((n = t.css) && (n = pq.styleObj(n)), r = t.cells, o = [], i = 0; i < d; i++)(a = r[i] || {}).css && l.getPdfStyle(a, pq.styleObj(a.css)), n && l.getPdfStyle(a, n), o[i] = a;
						c.push(o)
					})
				}
				return u(t), u(e), {
					body: c,
					headerRows: s
				}
			},
			extendT: function(t, e) {
				var n, i;
				for (n in e) void 0 === t[n] && ((i = Object.getOwnPropertyDescriptor(e, n)).get || i.set ? Object.defineProperty(t, n, i) : (i = e[n], t[n] = i && "object" == typeof i ? d.extend(!0, {}, i) : i));
				return t
			},
			flatten: function(t, e) {
				var n, i = 0,
					r = t.length;
				for (e = e || []; i < r; i++) null != (n = t[i]) && (n.push ? pq.flatten(n, e) : e.push(n));
				return e
			},
			toRC: function(t) {
				var e, t = t.match(/([A-Z]*)(\d*)/),
					n = pq.toNumber(t[1]);
				return [e = t[2] ? t[2] - 1 : e, n]
			},
			formatEx: function(t, e, n, i) {
				return n && (i = i || pq.getDataType(t), pq.filter.conditions[n][i]) ? this.format(t, e, i) : e
			},
			format: function(t, e, n) {
				var i = t.format;
				if (i && null != e) {
					if (pq.isFn(i)) return i(e);
					if ("date" == (n = n || pq.getDataType(t))) try {
						var r = new Date(e);
						r && !isNaN(r.getTime()) && (e = d.datepicker.formatDate(i, r))
					} catch (t) {} else e = pq.formatNumber(e, i)
				}
				return e
			},
			onResize: function(t, e) {
				t.attachEvent ? t.attachEvent("onresize", e) : window.ResizeObserver ? new window.ResizeObserver(e).observe(t) : window.addResizeListener ? window.addResizeListener(t, e) : d(t).resize(e)
			},
			fileRead: function(t, e, n) {
				var i = new FileReader;
				i[e](t), i.onload = function() {
					n(i.result)
				}
			},
			fileToBase: function(t, e) {
				pq.fileRead(t, "readAsDataURL", e)
			},
			xmlhttp: function(t, e, n) {
				var i = new XMLHttpRequest;
				i.onload = function() {
					n(i.response)
				}, i.open("GET", t), i.responseType = e, i.send()
			},
			urlToBase: function(t, e) {
				pq.xmlhttp(t, "blob", function(t) {
					pq.fileToBase(t, e)
				})
			},
			objectAttr: function(t) {
				t && t.split(" ")
			},
			deFormat: function(t, e, n) {
				if (e) {
					var i, r, o = t.format;
					if (o && (r = pq.getDataType(t), !n || pq.filter.conditions[n][r])) try {
						pq.isFn(o) ? e = t.deFormat(e) : "date" == r ? (i = t.formatRaw || "mm/dd/yy") != o && (e = d.datepicker.parseDate(o, e), e = d.datepicker.formatDate(i, e)) : e = pq.deFormatNumber(e, o)
					} catch (t) {
						e = null
					}
				}
				return e
			},
			fakeEvent: function(t, e, n) {
				var i;
				"timeout" == e && t.off(e = "keyup change").on(e, function() {
					clearTimeout(i), i = setTimeout(function() {
						t.triggerHandler("timeout")
					}, n)
				})
			},
			getScript: function(t, e) {
				var n;
				d('script[src="' + t + '"]').length ? e() : ((n = document.createElement("script")).onload = e, n.src = t, document.head.appendChild(n))
			},
			getScripts: function(t, e, n) {
				n = n || 0, pq.getScript(t[n], function() {
					++n == t.length ? e() : pq.getScripts(t, e, n)
				})
			},
			getAddress: function(t) {
				var e, n, t = t.split(":"),
					i = this.toRC(t[0]),
					r = i[0],
					i = i[1],
					t = this.toRC(t[1] || t[0]),
					o = t[0],
					t = t[1];
				return {
					r1: r,
					c1: i,
					rc: e = isNaN(o) ? e : o - r + 1,
					cc: n = isNaN(t) ? n : t - i + 1,
					r2: o,
					c2: t
				}
			},
			getClsVal: function(t, e) {
				t = t.match(new RegExp("\\b" + e + "(\\S+)\\b"));
				return t ? t[1] : null
			},
			getDataType: function(t) {
				var e, t = t.dataType;
				return "bool" == t ? e = "bool" : "float" == t || "integer" == t ? e = "number" : "date" == t && (e = "date"), e || "string"
			},
			getFn: (o = {}, function(t) {
				var e = t;
				return pq.isStr(t) && !(e = o[t]) && (e = window, t.split(".").forEach(function(t) {
					e = e[t]
				}), o[t] = e), e
			}),
			isLink: function(t) {
				return (t + "").match(/^<a\s+href=(?:"([^"]+)"|'([^']+)').*?>(.*?)<\/a>$/)
			},
			isFn: function(t) {
				return "function" == typeof t
			},
			isStr: function(t) {
				return "string" == typeof t
			},
			isCtrl: function(t) {
				return t.ctrlKey || t.metaKey
			},
			isDateFormat: (r = {}, function(t) {
				var e = r[t];
				return e = null == e ? r[t] = /^[mdy\s-\/\.,]*$/i.test(t) : e
			}),
			isEmpty: function(t) {
				for (var e in t) return !1;
				return !0
			},
			isObject: function(t) {
				return "[object Object]" === Object.prototype.toString.call(t)
			},
			juiToExcel: (i = {}, function(t) {
				var e = i[t];
				return e || (e = t.replace(/y/g, "yy").replace(/DD/g, "dddd").replace(/D/g, "ddd").replace(/MM/g, "mmmm").replace(/M/g, "mmm"), i[t] = e), e
			}),
			makePopup: function(n, i, t, r) {
				function o(t) {
					t && l && document.body.contains(i) ? s.hide() : s.remove()
				}
				var e = "mousedown.pq" + (Math.random() + "").replace(".", ""),
					a = i ? (i.nodeName || "").toLowerCase() : "",
					l = "input" == a || "textarea" == a,
					s = d(n);
				s.addClass("pq-popup").on("keydown", function(t) {
					t.keyCode != d.ui.keyCode.ESCAPE || t.isDefaultPrevented() || (o(!0), i && document.contains(i) && i.focus())
				}), d(i).one("remove", function() {
					o()
				}), s.one("remove", function() {
					d(document).off(e), t && t()
				}), requestAnimationFrame(function() {
					d(document).on(e, function(t) {
						var e = d(t.target);
						!s.is(":visible") || n.contains(e[0]) || pq.isCtrl(t) || e.closest(".ui-datepicker").length || r && e.closest(r).length || e.closest(i).length && 9 != t.keyCode || o(!0)
					})
				})
			},
			moveItem: function(t, e, n, i) {
				return i < n ? (e.splice(n, 1), e.splice(i++, 0, t)) : n == i ? i++ : (e.splice(i, 0, t), e.splice(n, 1)), i
			},
			newLine: function(t) {
				return isNaN(t) && pq.isStr(t) ? t.replace(/(\r\n|\r|\n)/g, "<br>") : t
			},
			objectify: function(t) {
				for (var e = {}, n = t.length; n--;) e[t[n]] = 1;
				return e
			},
			zip: function(t, e, n) {
				var i = JSZip();
				return i.file(t, e), i.generate({
					type: n || "base64",
					compression: "DEFLATE"
				})
			},
			postData: function(e, t, n) {
				d.ajax(d.extend({
					url: e,
					type: "POST",
					cache: !1,
					data: t,
					success: function(t) {
						e = e + (0 < e.indexOf("?") ? "&" : "?") + "pq_filename=" + t, d(document.body).append("<iframe height='0' width='0' frameborder='0' src=\"" + e + '"></iframe>')
					}
				}, n))
			},
			saveAs: function(t, e) {
				var n, i, t = "string" == typeof t ? new Blob([t]) : t;
				navigator.msSaveOrOpenBlob ? navigator.msSaveOrOpenBlob(t, e) : (n = document.createElement("a"), i = d(n), t = n.href = URL.createObjectURL(t), n.download = e, d(document.body).append(n), n.click(), i.remove(), URL.revokeObjectURL(t))
			},
			styleObj: function(t, e) {
				function n() {
					"" === r ? delete e[i] : e[i] = r
				}
				if (e = e || {}, pq.isStr(t)) {
					var i, r, o = t.split(";");
					o.forEach(function(t) {
						t && (o = t.split(":"), i = o[0], r = o[1], i && null != r && (r = r.trim(), "border" == i ? pq.borderP.forEach(function(t) {
							i = "border-" + t, n()
						}) : n()))
					})
				} else
					for (i in t) r = t[i], n();
				return e
			},
			tint: function(t, e) {
				t = t.replace(/^#/, ""), e = +e;

				function n(t, e) {
					return t = t.slice(e, e + 2), parseInt(t, 16)
				}

				function i(t) {
					return t += (255 - t) * e, (t = 255 < (t = Math.round(t)) ? 255 : t).toString(16).toUpperCase()
				}
				var r = n(t, 0),
					o = n(t, 2),
					t = n(t, 4);
				return i(r) + i(o) + i(t)
			},
			camelCase: function(t) {
				var e;
				if (t) return e = (t = t.split("-"))[1], t[0] + (e ? e[0].toUpperCase() + e.slice(1) : "")
			},
			styleStr: function(t) {
				if ("string" != typeof t) {
					var e, n, i = [];
					for (e in t) null != (n = t[e]) && i.push(e + ":" + n);
					t = i.length ? i.join(";") + ";" : ""
				}
				return t
			},
			escapeXml: function(t) {
				var n = {
					"&": "&amp;",
					"<": "&lt;",
					">": "&gt;",
					'"': "&quot;",
					"'": "&apos;"
				};
				return t && (t + "").replace(/(&|\<|\>|"|')/g, function(t, e) {
					return n[e]
				})
			},
			escapeXmlAttr: function(t) {
				var n = {
					"&": "&amp;",
					"<": "&lt;",
					'"': "&quot;"
				};
				return t && (t + "").replace(/(&|\<|")/g, function(t, e) {
					return n[e]
				})
			},
			unescapeXml: (n = {
				amp: "&",
				lt: "<",
				gt: ">",
				quot: '"',
				apos: "'"
			}, function(t) {
				return t.replace(/&(amp|lt|gt|quot|apos);/g, function(t, e) {
					return n[e]
				})
			})
		}), t.select = function(t) {
			var e, n = t.attr,
				i = t.options,
				r = t.groupIndx,
				o = t.labelIndx,
				a = t.valueIndx,
				l = null != o && null != a,
				s = null != r,
				d = t.prepend,
				c = t.dataMap,
				u = ["<select ", n, " >"];
			if (d)
				for (var h in d) u.push('<option value="', h, '">', d[h], "</option>");
			if (i && i.length) {
				for (var f = 0, p = i.length; f < p; f++) {
					var g = i[f];
					if (l) {
						var m, v, w, x = g[a],
							y = g.pq_disabled ? 'disabled="disabled" ' : "",
							C = g.pq_selected ? 'selected="selected" ' : "";
						null != x && (w = c ? function() {
							for (var t = {}, e = 0; e < c.length; e++) {
								var n = c[e];
								t[n] = g[n]
							}
							return "data-map='" + JSON.stringify(t) + "'"
						}() : "", s && (v = g.pq_disabled_group ? 'disabled="disabled" ' : "", e != (m = g[r]) && (null != e && u.push("</optgroup>"), u.push('<optgroup label="', m, '" ', v, " >"), e = m)), o == a ? u.push("<option ", C, y, w, ">", x, "</option>") : (v = g[o], u.push("<option ", C, y, w, ' value="', x, '">', v, "</option>")))
					} else if ("object" == typeof g)
						for (var h in g) u.push('<option value="', h, '">', g[h], "</option>");
					else u.push("<option>", g, "</option>")
				}
				s && u.push("</optgroup>")
			}
			return u.push("</select>"), u.join("")
		}, d.fn.pqval = function(t) {
			var e;
			return t ? t.incr ? (e = this.data("pq_value"), this.prop("indeterminate", !1), e ? this.prop("checked", e = !1) : !1 === e ? (this.prop("indeterminate", !(e = null)), this.prop("checked", !1)) : this.prop("checked", e = !0), this.data("pq_value", e), e) : (e = t.val, this.data("pq_value", e), this.prop("indeterminate", !1), null === e ? (this.prop("indeterminate", !0), this.prop("checked", !1)) : e ? this.prop("checked", !0) : this.prop("checked", !1), this) : this.data("pq_value")
		}, t.xmlToArray = function(t, e) {
			var n = e.itemParent,
				r = e.itemNames,
				o = [];
			return d(t).find(n).each(function(t, e) {
				var n = d(e),
					i = [];
				d(r).each(function(t, e) {
					i.push(n.find(e).text().replace(/\r|\n|\t/g, ""))
				}), o.push(i)
			}), o
		}, t.xmlToJson = function(t, e) {
			var n = e.itemParent,
				l = e.itemNames,
				s = [];
			return d(t).find(n).each(function(t, e) {
				for (var n = d(e), i = {}, r = 0, o = l.length; r < o; r++) {
					var a = l[r];
					i[a] = n.find(a).text().replace(/\r|\n|\t/g, "")
				}
				s.push(i)
			}), s
		}, t.tableToArray = function(t) {
			var t = d(t),
				i = [],
				r = [],
				t = t.children("tbody").children("tr"),
				e = t.length ? d(t[0]) : d(),
				o = 1 < t.length ? d(t[1]) : d();
			return e.children("th,td").each(function(t, e) {
				var e = d(e),
					n = "left",
					e = {
						title: e.html(),
						width: e.width(),
						dataType: "string",
						align: n = o.length ? o.find("td:eq(" + t + ")").attr("align") || n : n,
						dataIndx: t
					};
				i.push(e)
			}), t.each(function(t, e) {
				var n;
				0 != t && (t = d(e), n = [], t.children("td").each(function(t, e) {
					n.push(d.trim(d(e).html()))
				}), r.push(n))
			}), {
				data: r,
				colModel: i
			}
		}, s = {}, function(t, e) {
			var n;
			if (t) {
				if (n = t.split(":"), t = e && 1 < n.length ? n[1] : n[0], n = s[t]) return n;
				l = l || /^([^#0]*|&#[^#0]*)?[\,\.#0]*?([\,\s\.]?)([#0]*)(([\,\s\.])([0]+))?([^#^0]*|&#[^#]*)?$/, (e = t.match(l)) && e.length && (n = {
					symbol: e[1] || "",
					thouSep: e[2],
					thousand: e[3].length,
					decSep: e[5] || "",
					decimal: (e[6] || []).length,
					symbolEnd: e[7] || ""
				}, s[t] = n)
			}
			return n = n || {
				symbol: "",
				symbolEnd: "",
				thouSep: ",",
				thousand: 3,
				decSep: ".",
				decimal: 2
			}
		}),
		h = (t.formatCurrency = function(t, e) {
			if (!e || "@" == e) return t + "";
			t = parseFloat(t);
			if (!isNaN(t) && "Infinity" != t && "-Infinity" != t) {
				0 < (e || "").indexOf("%") && (t *= 100);
				for (var n = t < 0, e = f(e, n), i = e.symbol, r = e.symbolEnd, o = e.thousand, a = e.thouSep, l = e.decSep, e = e.decimal, s = (t = t.toFixed(e)).length, e = e + l.length, d = t.substring(0, s - e), t = t.substring(s - e + l.length, s), c = d.match(/\d/g).reverse(), u = [], h = 0; h < c.length; h++) 0 < h && h % o == 0 && u.push(a), u.push(c[h]);
				return (n ? "-" : "") + i + (d = (u = u.reverse()).join("")) + l + t + r
			}
		}, pq.formatNumber = t.formatCurrency, pq.deFormatNumber = function(t, e) {
			var e = f(e, t < 0),
				n = e.symbol,
				i = e.symbolEnd,
				r = e.thouSep,
				e = e.decSep,
				r = "." === r ? "\\." : r;
			return t = t.replace(n, "").replace(i, "").replace(new RegExp(r, "g"), ""), t = e ? +t.replace(e, ".") : t
		}, pq.valid = {
			isFloat: function(t) {
				var e = +t;
				return !isNaN(e) && e == t
			},
			isInt: function(t) {
				var e = parseInt(t);
				return !isNaN(e) && e == t
			},
			isDate: function(t) {
				return !isNaN(Date.parse(t))
			}
		}, []),
		p = {},
		g = pq.toLetter = function(t) {
			var e, n, i = h[t];
			return i || (n = ++t % 26, e = t / 26 | 0, n = n ? String.fromCharCode(64 + n) : (--e, "Z"), i = e ? g(e - 1) + n : n, h[--t] = i, p[i] = t), i
		};

	function m(t) {
		var e = t.rtl;
		return e = null == e ? t.rtl = "rtl" == d(t).css("direction") : e
	}
	pq.toNumber = function(t) {
		var e, n, i = p[t];
		if (null == i && t) {
			for (e = t.length, i = -1, n = 0; n < e; n++) i += (t[n].charCodeAt(0) - 64) * Math.pow(26, e - n - 1);
			h[i] = t, p[t] = i
		}
		return i
	}, pq.generateData = function(t, e) {
		for (var n = [], i = 0; i < e; i++) n[i] = g(i);
		for (var r = [], i = 0; i < t; i++)
			for (var o = r[i] = [], a = 0; a < e; a++) o[a] = n[a] + (i + 1);
		return r
	}, c = "w", u = "scrollLeft", d(document).one("pq:ready", function() {
		var t = d("<div dir='rtl' style='visibilty:hidden;height:4px;width:4px;overflow:auto;'>rtl</div>").appendTo("body"),
			e = t[0];
		0 == e[u] && (e[u] = 100, c = 0 == e[u] ? "g" : "i"), t.remove()
	}), pq.scrollTop = function(t) {
		return t.scrollTop
	}, pq[u + "Val"] = function(t, e) {
		t = m(t) ? "w" == c ? t.scrollWidth - t.clientWidth - e : "g" == c ? -1 * e : e : e;
		return t
	}, pq[u] = function(t, e) {
		var n, i = m(t);
		if (null == e) {
			if (n = t[u], i) {
				if ("w" == c) return t.scrollWidth - t.clientWidth - n;
				if ("g" == c) return -1 * n
			}
			return n
		}
		t[u] = pq[u + "Val"](t, e)
	}
}(jQuery), ! function(q) {
	pq.validations = {
		minLen: function(t, e, n) {
			if (t = n(t), e = n(e), t.length >= e) return !0
		},
		nonEmpty: function(t) {
			if (null != t && "" !== t) return !0
		},
		maxLen: function(t, e, n) {
			if (t = n(t), e = n(e), t.length <= e) return !0
		},
		gt: function(t, e, n) {
			if (t = n(t), (e = n(e)) < t) return !0
		},
		gte: function(t, e, n) {
			if (t = n(t), (e = n(e)) <= t) return !0
		},
		lt: function(t, e, n) {
			if ((t = n(t)) < (e = n(e))) return !0
		},
		lte: function(t, e, n) {
			if ((t = n(t)) <= (e = n(e))) return !0
		},
		neq: function(t, e, n) {
			if ((t = n(t)) !== (e = n(e))) return !0
		},
		regexp: function(t, e) {
			if (new RegExp(e).test(t)) return !0
		}
	};
	var t = q.paramquery;
	t.cValid = function(t) {
		this.that = t
	}, t.cValid.prototype = {
		_isValidCell: function(t) {
			var e = this.that,
				n = t.column,
				i = n.validations;
			if (!i || !i.length) return {
				valid: !0
			};

			function r(t) {
				return e.getValueFromDataType(t, a, !0)
			}
			var o = t.value,
				a = n.dataType,
				l = t.rowData;
			if (!l) throw "rowData required.";
			for (var s = 0; s < i.length; s++) {
				var d = i[s],
					c = d.on,
					u = d.type,
					h = !1,
					f = d.msg,
					p = d.value;
				if (!1 !== c)
					if ((c = pq.validations[u]) ? h = null != o && c(o, p, r) : u && !(c = {
							column: n,
							value: o,
							rowData: l,
							msg: f
						}) === e.callFn(u, c) ? (h = !1, f = c.msg) : h = !0, !h) return {
						valid: !1,
						msg: f,
						column: n,
						warn: d.warn,
						dataIndx: n.dataIndx,
						validation: d
					}
			}
			return {
				valid: !0
			}
		},
		onScrollCell: function(t, e, n, i, r, o) {
			var a, l = this.that;
			l.options.bootstrap;
			if (t || (a = l.getEditCell()) && a.$cell) {
				l = t || a.$td, t = (l.attr("title", e), "tooltip");
				try {
					l[t]("destroy")
				} catch (t) {}
				l[t]({
					trigger: "manual",
					position: {
						my: "left center+5",
						at: "right center"
					},
					content: function() {
						return ("" == n ? "" : "<span class='ui-icon " + n + " pq-tooltip-icon'></span>") + e
					},
					open: function(t, e) {
						var n, e = e.tooltip;
						i && e.addClass(i), o && (n = e.attr("style"), e.attr("style", n + ";" + o)), r && e.tooltip.css(r)
					}
				})[t]("open")
			}
		},
		isValidCell: function(t) {
			var e = this,
				n = e.that,
				i = t.rowData,
				r = t.rowIndx,
				o = t.value,
				a = t.valueDef,
				l = t.column,
				s = t.focusInvalid,
				d = n.options,
				c = t.allowInvalid,
				u = l.dataIndx,
				h = d.validation,
				f = d.warning,
				p = d.editModel,
				g = p.invalidClass,
				p = p.warnClass,
				m = document.activeElement;
			if (t.checkEditable && 0 == n.isEditable({
					rowIndx: r,
					rowData: i,
					column: l,
					dataIndx: u
				})) return {
				valid: !0
			};
			var v, w, x, y, t = this._isValidCell({
					column: l,
					value: o,
					rowData: i
				}),
				l = t.valid,
				o = t.warn,
				C = t.msg;
			if (l ? n.data({
					rowData: i,
					dataIndx: u,
					data: "pq_valid"
				}) && (n.removeClass({
					rowData: i,
					rowIndx: r,
					dataIndx: u,
					cls: p + " " + g
				}), n.removeData({
					rowData: i,
					dataIndx: u,
					data: "pq_valid"
				})) : (f = q.extend({}, o ? f : h, t.validation), v = f.css, w = f.cls, x = f.icon, y = f.style), c || o) return l ? {
				valid: !0
			} : (n.addClass({
				rowData: i,
				rowIndx: r,
				dataIndx: u,
				cls: o ? p : g
			}), n.data({
				rowData: i,
				dataIndx: u,
				data: {
					pq_valid: {
						css: v,
						icon: x,
						style: y,
						msg: C,
						cls: w
					}
				}
			}), t);
			if (!l) {
				if (null == r) {
					h = n.getRowIndx({
						rowData: i,
						dataUF: !0
					});
					if (null == (r = h.rowIndx) || h.uf) return t.uf = h.uf, t
				}
				if (s) {
					if (a) {
						if (q(m).hasClass("pq-editor-focus")) {
							f = d.editModel.indices;
							if (f) {
								c = f.rowIndx, o = f.dataIndx;
								if (null != r && r != c) throw "incorrect usage of isValid rowIndx: " + r;
								if (u != o) throw "incorrect usage of isValid dataIndx: " + u;
								n.editCell({
									rowIndx: c,
									dataIndx: u
								})
							}
						}
					} else {
						n.goToPage({
							rowIndx: r
						});
						var b = n.normalize({
								rowIndx: r,
								dataIndx: u
							}),
							I = n.getCell(b);
						n.scrollCell(b, function() {
							e.onScrollCell(I, C, x, w, v, y), n.focus(b)
						})
					}
					this.onScrollCell(I, C, x, w, v, y)
				}
				return t
			}
			if (a) {
				p = n.getEditCell();
				if (p && p.$cell) {
					g = p.$td;
					g.removeAttr("title");
					try {
						g.tooltip("destroy")
					} catch (t) {}
				}
			}
			return {
				valid: !0
			}
		},
		isValid: function(t) {
			var e, n = this.that,
				i = (t = t || {}).allowInvalid,
				r = t.focusInvalid,
				o = t.checkEditable,
				i = null != i && i;
			if (null != (f = t.dataIndx)) return u = n.columns[f], a = t.rowData || n.getRowData(t), g = (e = t.hasOwnProperty("value")) ? t.value : a[f], (p = this.isValidCell({
				rowData: a,
				checkEditable: o,
				rowIndx: t.rowIndx,
				value: g,
				valueDef: e,
				column: u,
				allowInvalid: i,
				focusInvalid: r
			})).valid || p.warn ? {
				valid: !0
			} : p;
			if (null != t.rowIndx || null != t.rowIndxPage || null != t.rowData) {
				for (var a = t.rowData || n.getRowData(t), l = n.colModel, s = [], d = 0, c = l.length; d < c; d++) {
					var u, h = (u = l[d]).hidden;
					if (!h) {
						var f, p, g = a[f = u.dataIndx];
						if (!(p = this.isValidCell({
								rowData: a,
								value: g,
								column: u,
								rowIndx: t.rowIndx,
								checkEditable: o,
								allowInvalid: i,
								focusInvalid: r
							})).valid && !p.warn) {
							if (!i) return p;
							s.push({
								rowData: a,
								dataIndx: f,
								column: u
							})
						}
					}
				}
				return i && s.length ? {
					cells: s,
					valid: !1
				} : {
					valid: !0
				}
			}
			var m = t.data || n.options.dataModel.data,
				s = [];
			if (!m) return null;
			for (d = 0, c = m.length; d < c; d++) {
				var a = m[d],
					v = this.isValid({
						rowData: a,
						rowIndx: void 0,
						checkEditable: o,
						allowInvalid: i,
						focusInvalid: r
					}),
					w = v.cells;
				if (!1 === i) {
					if (!v.valid) return v
				} else w && w.length && (s = s.concat(w))
			}
			return i && s.length ? {
				cells: s,
				valid: !1
			} : {
				valid: !0
			}
		}
	}
}(jQuery), ! function(a) {
	var t = {
			options: {
				curPage: 0,
				totalPages: 0,
				totalRecords: 0,
				msg: "",
				rPPOptions: [10, 20, 30, 40, 50, 100],
				rPP: 20,
				layout: ["first", "prev", "|", "strPage", "|", "next", "last", "|", "strRpp", "|", "refresh", "|", "strDisplay"]
			},
			_create: function() {
				var n = this,
					i = n.options,
					t = i.rtl,
					e = n.element,
					r = {
						first: n.initButton(i.strFirstPage, "seek-" + (t ? "end" : "first"), "first"),
						"|": "<td><span class='pq-separator'></span></td>",
						next: n.initButton(i.strNextPage, "seek-" + (t ? "prev" : "next"), "next"),
						prev: n.initButton(i.strPrevPage, "seek-" + (t ? "next" : "prev"), "prev"),
						last: n.initButton(i.strLastPage, "seek-" + (t ? "first" : "end"), "last"),
						strPage: n.getPageOf(),
						strRpp: n.getRppOptions(),
						refresh: n.initButton(i.strRefresh, "refresh", "refresh"),
						strDisplay: "<td><span class='pq-page-display'>" + n.getDisplay() + "</span></td>"
					},
					t = i.layout.map(function(t) {
						return r[t]
					}).join("");
				n.listeners = {}, e.html("<table style='border-collapse:collapse;'><tr>" + t + "</tr></table>"), e.addClass("pq-pager"), n.$first = e.find(".pq-page-first"), n.bindButton(n.$first, function(t) {
					1 < i.curPage && n.onChange(t, 1)
				}), n.$prev = e.find(".pq-page-prev"), n.bindButton(n.$prev, function(t) {
					var e;
					1 < i.curPage && (e = i.curPage - 1, n.onChange(t, e))
				}), n.$next = e.find(".pq-page-next"), n.bindButton(n.$next, function(t) {
					var e;
					i.curPage < i.totalPages && (e = i.curPage + 1, n.onChange(t, e))
				}), n.$last = e.find(".pq-page-last"), n.bindButton(n.$last, function(t) {
					var e;
					i.curPage !== i.totalPages && (e = i.totalPages, n.onChange(t, e))
				}), n.$refresh = e.find(".pq-page-refresh"), n.bindButton(n.$refresh, function(t) {
					if (!1 === n._trigger("beforeRefresh", t)) return !1;
					n._trigger("refresh", t)
				}), n.$display = e.find(".pq-page-display"), n.$select = e.find(".pq-page-select").val(i.rPP).on("change", n.onChangeSelect.bind(n)), n.$totalPages = e.find(".pq-page-total"), n.$curPage = e.find(".pq-page-current"), n.bindCurPage(n.$curPage)
			},
			_destroy: function() {
				this.element.empty().removeClass("pq-pager").enableSelection(), this._trigger("destroy")
			},
			_setOption: function(t, e) {
				this._super(t, e = "curPage" != t && "totalPages" != t ? e : +e)
			},
			_setOptions: function(t) {
				var e, n = !1,
					i = this.options;
				for (e in t) {
					var r = t[e],
						o = typeof r;
					"string" != o && "number" != o && (pq.isFn(r.splice) || a.isPlainObject(r)) ? JSON.stringify(r) != JSON.stringify(i[e]) && (this._setOption(e, r), n = !0) : r != i[e] && (this._setOption(e, r), n = !0)
				}
				return n && this._refresh(), this
			}
		},
		t = (a.widget("paramquery.pqPager", t), pq.pager = function(t, e) {
			t = a(t).pqPager(e);
			return t.data("paramqueryPqPager") || t.data("paramquery-pqPager")
		}, a.paramquery),
		e = t.pqPager;
	e.regional = {}, e.defaults = e.prototype.options, a.extend(e.prototype, {
		bindButton: function(t, e) {
			t.on("click keydown", function(t) {
				if ("click" == t.type || t.keyCode == a.ui.keyCode.ENTER) return e.call(this, t)
			})
		},
		bindCurPage: function(t) {
			var i = this,
				r = this.options;
			t.on("keydown", function(t) {
				t.keyCode === a.ui.keyCode.ENTER && a(this).trigger("change")
			}).on("change", function(t) {
				var e = a(this),
					n = e.val();
				return isNaN(n) || n < 1 || (n = parseInt(n)) !== r.curPage && (n > r.totalPages || !1 === i.onChange(t, n)) ? (e.val(r.curPage), !1) : void 0
			})
		},
		initButton: function(t, e, n) {
			return "<td><span class='pq-ui-button ui-widget-header pq-page-" + n + "' tabindex='0' title='" + t + "'><span class='ui-icon ui-icon-" + e + "'></span></span></td>"
		},
		onChange: function(t, e) {
			e = {
				curPage: e
			};
			if (!1 === this._trigger("beforeChange", t, e)) return !1;
			this._trigger("change", t, e)
		},
		onChangeSelect: function(t) {
			var e = a(t.target),
				n = +e.val(),
				i = {
					rPP: n
				};
			if (!1 === this._trigger("beforeChange", t, i)) return e.val(this.options.rPP), !1;
			this.options.rPP = n, this._trigger("change", t, i)
		},
		refresh: function() {
			this._destroy(), this._create()
		},
		format: function(t) {
			var e = t.format;
			return function(t) {
				return e ? pq.formatNumber(t, e) : t
			}
		},
		_refresh: function() {
			var t = this,
				e = t.options,
				n = e.curPage >= e.totalPages;
			t.setDisable(t.$next, n), t.setDisable(t.$last, n), n = e.curPage <= 1, t.setDisable(t.$first, n), t.setDisable(t.$prev, n), t.$totalPages.text(t.format(e)(e.totalPages)), t.$curPage.val(e.curPage), t.$select.val(e.rPP), t.$display.html(this.getDisplay()), t._trigger("refreshView")
		},
		getDisplay: function() {
			var t, e, n, i = this.options,
				r = this.format(i),
				o = 0 < i.totalRecords ? (t = i.rPP, o = i.strDisplay || "", e = i.curPage, (i = i.totalRecords) < (n = e * t) && (n = i), (o = (o = o.replace("{0}", r(1 + (e - 1) * t))).replace("{1}", r(n))).replace("{2}", r(i))) : "";
			return o
		},
		getPageOf: function() {
			var t = this.options;
			return "<td><span>" + (t.strPage || "").replace("{0}", "<input type='text' value='" + t.curPage + "' tabindex='0' class='pq-page-current ui-corner-all' />").replace("{1}", "<span class='pq-page-total'>" + this.format(t)(t.totalPages) + "</span>") + "</span></td>"
		},
		getRppOptions: function() {
			var t, e, n, i, r = this.options,
				o = r.rPPOptions,
				a = 0,
				l = o.length,
				s = this.format(r),
				r = r.strRpp || "";
			if (r && -1 != r.indexOf("{0}")) {
				for (i = ["<select class='ui-corner-all pq-page-select' >"]; a < l; a++) e = +(e = o[a]) == e ? s(t = e) : e[t = Object.keys(e)[0]], i.push('<option value="', t, '">', e, "</option>");
				i.push("</select>"), n = i.join(""), r = r.replace("{0}", n) + "</span>"
			}
			return "<td><span class='pq-page-rppoptions'>" + r + "</span></td>"
		},
		_trigger: t._trigger,
		on: t.on,
		one: t.one,
		off: t.off,
		setDisable: function(t, e) {
			t[e ? "addClass" : "removeClass"]("disabled").css("pointer-events", e ? "none" : "").attr("tabindex", e ? "" : "0")
		}
	})
}(jQuery), ! function(F) {
	function t() {}
	t.prototype = {
		belongs: function(t) {
			if (t.target == this.that.element[0]) return !0
		},
		setTimer: function(t, e) {
			clearTimeout(this._timeID), this._timeID = setTimeout(function() {
				t()
			}, e)
		}
	};
	var P = F.paramquery,
		e = (P.cClass = t, {
			widgetEventPrefix: "pqgrid"
		}),
		A = (e._createWidget = function(t, e) {
			return this.origOptions = t, F(document).triggerHandler("pq:ready"), F.Widget.prototype._createWidget.apply(this, arguments)
		}, e._create = function() {
			var n = this,
				t = n.options,
				e = n.element,
				i = n.eventNamespace,
				r = t.bootstrap,
				o = r.on,
				a = t.roundCorners && !o,
				l = t.summaryOnTop,
				s = "<div class='pq-summary-outer' ></div>",
				d = t.ui,
				c = (F(document).triggerHandler("pqGrid:bootup", {
					instance: this
				}), n.BS_on = o, t.collapsible || (t.collapsible = {
					on: !1,
					collapsed: !1
				}), t.flexHeight && (t.height = "flex"), t.flexWidth && (t.width = "flex"), n.iRefresh = new P.cRefresh(n), n.iValid = new P.cValid(n), n.tables = [], n.$tbl = null, n.iCols = new P.cColModel(n), n.iSort = new P.cSort(n), e.on("scroll" + i, function() {
					this.scrollLeft = 0, this.scrollTop = 0
				}).on("mousedown" + i, n._mouseDown.bind(n)), (o ? r : d).grid),
				u = o ? "" : d.header_o,
				h = o ? "" : d.bottom,
				o = (o ? r : d).top,
				r = (e.empty().attr({
					role: "grid",
					dir: t.rtl ? "rtl" : "ltr"
				}).addClass("pq-grid pq-theme " + c + " " + (a ? " ui-corner-all" : "")).html(["<div class='pq-grid-top ", o, " ", a ? " ui-corner-top" : "", "'>", "<div class='pq-grid-title", a ? " ui-corner-top" : "", "'>&nbsp;</div>", "<div class='pq-grid-pbar' style='background:red;height:2px;width:0%;display:none;'>&nbsp;</div>", "</div>", "<div class='pq-grid-center-o'>", "<div class='pq-tool-panel' style='display:", t.toolPanel.show ? "" : "none", ";'></div>", "<div class='pq-grid-center' >", "<div class='pq-header-outer ", u, "' ></div>", l ? s : "", "<div class='pq-body-outer' ></div>", l ? "" : s, "</div>", "<div style='clear:both;'></div>", "</div>", "<div class='pq-grid-bottom ", h, " ", a ? " ui-corner-bottom" : "", "'>", "<div class='pq-grid-footer'></div>", "</div>"].join("")), n.setLocale(), n.$bottom = F(".pq-grid-bottom", e), n.$summary = F(".pq-summary-outer", e), n.$toolPanel = e.find(".pq-tool-panel"), n.$top = F("div.pq-grid-top", e), t.showTop || n.$top.css("display", "none"), n.$title = F("div.pq-grid-title", e), t.showTitle || n.$title.css("display", "none"), n.$grid_center = F(".pq-grid-center", e).on("scroll", function() {
					this.scrollTop = 0
				}));
			n.$header = F(".pq-header-outer", r).on("scroll", function() {
				this.scrollTop = 0, this.scrollLeft = 0
			});
			n.$footer = F(".pq-grid-footer", e), d = n.$cont = F(".pq-body-outer", r), r.on("mousedown", n._onGCMouseDown.bind(n)), n.iRenderB = new pq.cRenderBody(n, {
				$center: r,
				$b: d,
				$sum: n.$summary,
				header: !0,
				$h: n.$header
			}), n._trigger("render", null, {
				dataModel: n.options.dataModel,
				colModel: n.colModel
			}), n.iKeyNav = new P.cKeyNav(n), "ontouchend" in document && (n.addTouch(), n.contextIOS(e)), e.on("contextmenu" + i, n.onContext.bind(n)), d.on("click", ".pq-grid-cell,.pq-grid-number-cell", function(t) {
				var e = t.target;
				if (!0 !== F.data(e, n.widgetName + ".preventClickEvent")) return n.evtBelongs(t) ? (e = F(e)).is("label") && (e = e.find('input[type="checkbox"]')).length ? (t.preventDefault(), void e.trigger("click")) : n._onClickCell(t) : void 0
			}).on("dblclick", ".pq-grid-cell", function(t) {
				if (n.evtBelongs(t)) return n._onDblClickCell(t)
			}), d.on("mousedown", n._onMouseDown.bind(n)).on("change", n._onChange(n)).on("mouseenter", ".pq-grid-cell,.pq-grid-number-cell", n._onCellMouseEnter(n)).on("mouseenter", ".pq-grid-row", n._onRowMouseEnter(n)).on("mouseleave", ".pq-grid-cell", n._onCellMouseLeave(n)).on("mouseleave", ".pq-grid-row", n._onRowMouseLeave(n)).on("keyup", n._onKeyUp(n)), t.selectionModel.native || this.disableSelection(), r.on("keydown.pq-grid", n._onKeyDown(n)), this._refreshTitle(), n.iRows = new P.cRows(n), n.generateLoading(), n._initPager(), n._refreshResizable(), n._refreshDraggable(), n.iResizeColumns = new P.cResizeColumns(n), this._mouseInit()
		}, e.contextIOS = function(t) {
			var n, i, r, o = "contextmenu";
			t.on("touchstart", function(e) {
				n = 1, setTimeout(function() {
					var t;
					n && 1 == (r = e.originalEvent.touches).length && (t = r[0], t = F.Event(o, t), F(e.target).trigger(t), i = 1)
				}, 600), t.one(o, function() {
					n = 0
				})
			}).on("touchmove touchend", function(t) {
				n = 0, i && (i = 0, t.preventDefault())
			})
		}, e.addTouch = function() {
			var r, o, t = this.$grid_center[0];
			t.addEventListener("touchstart", function(t) {
				var e, n, i = t.target,
					t = t.changedTouches[0];
				r ? i && i == r.target && (e = r.x - t.pageX, n = r.y - t.pageY, Math.sqrt(e * e + n * n) <= 12 && (o = r, setTimeout(function() {
					o = null
				}, 500))) : (r = {
					x: t.pageX,
					y: t.pageY,
					target: i
				}, setTimeout(function() {
					r = null
				}, 400))
			}, !0), t.addEventListener("touchend", function(t) {
				var e = t.target;
				o && e == o.target && F(e).trigger("dblclick", t)
			})
		}, e._mouseDown = function(t) {
			var e = this;
			F(t.target).closest(".pq-editor-focus").length && (this._blurEditMode = !0, window.setTimeout(function() {
				e._blurEditMode = !1
			}, 0))
		}, e.destroy = function() {
			this._trigger("destroy"), this._super(), this.element = void 0
		}, e.setLocale = function() {
			var t = this.options,
				e = t.locale;
			t.strLocal != e && (F.extend(!0, t, P.pqGrid.regional[e]), F.extend(t.pageModel, P.pqPager.regional[e]))
		}, e._setOption = function(t, e) {
			function n() {
				a[t] = e
			}

			function i(t) {
				return t ? "addClass" : "removeClass"
			}
			var r, o = this,
				a = o.options,
				l = o.pageI,
				s = o.iRenderB,
				d = o.iRenderSum,
				c = o.iRenderHead,
				u = a.dataModel;
			if (!o.$title) return n(), o;
			if ("height" === t) n(), o._refreshResizable();
			else if ("locale" == t || "pageModel" == t) n(), "locale" == t && o.setLocale(), l && l.destroy();
			else if ("width" === t) n(), o._refreshResizable();
			else if ("title" == t) n(), o._refreshTitle();
			else if ("roundCorners" == t) {
				n();
				var h = i(e);
				o.element[h]("ui-corner-all"), o.$top[h]("ui-corner-top"), o.$bottom[h]("ui-corner-bottom")
			} else if ("freezeCols" == t) e = parseInt(e), !isNaN(e) && 0 <= e && e <= o.colModel.length - 2 && n();
			else if ("freezeRows" == t) e = parseInt(e), !isNaN(e) && 0 <= e && n();
			else if ("resizable" == t) n(), o._refreshResizable();
			else if ("draggable" == t) n(), o._refreshDraggable();
			else if ("dataModel" == t) e.data !== u.data && u.dataUF && (u.dataUF.length = 0), n();
			else {
				if ("groupModel" == t) throw "use groupOption() to set groupModel options.";
				if ("treeModel" == t) throw "use treeOption() to set treeModel options.";
				"colModel" === t || "columnTemplate" == t ? (n(), o.iCols.init()) : "disabled" === t ? (o._super(t, e), !0 === e ? o._disable() : o._enable()) : "strLoading" === t ? (n(), o._refreshLoadingString()) : "showTop" === t ? (n(), o.$top.css("display", e ? "" : "none")) : "showTitle" === t ? (n(), o.$title.css("display", e ? "" : "none")) : "showToolbar" === t ? (n(), o._toolbar.widget().css("display", e ? "" : "none")) : "collapsible" === t ? (n(), o._createCollapse()) : "showBottom" === t ? (n(), o.$bottom.css("display", e ? "" : "none")) : "wrap" == t || "hwrap" == t ? (n(), ("wrap" == t ? s.$tbl.add(d.$tbl) : c.$tbl)[i(!e)]("pq-no-wrap")) : "rowBorders" === t ? (n(), h = i(e), s.$tbl[h](r = "pq-td-border-top"), d.$tbl[h](r)) : "columnBorders" === t ? (n(), h = i(e), s.$tbl[h](r = "pq-td-border-right"), d.$tbl[h](r)) : "strNoRows" === t ? (n(), o.$cont.find(".pq-grid-norows").text(e)) : n()
			}
			return o
		}, e.options = {
			cancel: "input,textarea,button,select,option,.pq-no-capture,.ui-resizable-handle",
			trigger: !1,
			bootstrap: {
				on: !1,
				thead: "table table-striped table-condensed table-bordered",
				tbody: "table table-condensed",
				grid: "panel panel-default",
				top: "",
				btn: "btn btn-default",
				header_active: "active"
			},
			ui: {
				on: !0,
				grid: "ui-widget ui-widget-content",
				top: "ui-widget-header",
				bottom: "",
				header_o: "ui-widget-header",
				header: "ui-state-default",
				header_active: ""
			},
			format: function(t, e, n, i) {
				var r = "format",
					n = n[r];
				return null == n ? i[r] || e[r] : n
			},
			cellDatatype: function(t, e) {
				return e.dataType
			},
			collapsible: {
				on: !0,
				toggle: !0,
				collapsed: !1,
				_collapsed: !1,
				refreshAfterExpand: !0,
				css: {
					zIndex: 1e3
				}
			},
			colModel: null,
			columnBorders: !0,
			dataModel: {
				beforeSend: function() {},
				getData: function(t) {
					return t
				},
				data: [],
				dataUF: [],
				cache: !1,
				dataType: "JSON",
				location: "local",
				sorting: "local",
				sortDir: "up",
				method: "GET"
			},
			direction: "",
			draggable: !1,
			editable: !0,
			editModel: {
				pressToEdit: !0,
				charsAllow: ["0123456789.-=eE+", "0123456789-=eE+"],
				clicksToEdit: 2,
				filterKeys: !0,
				reInt: /^([-]?[1-9][0-9]*|[-]?[0-9]?)(e[-+]?)?[0-9]*$/i,
				reFloat: /^[-]?[0-9]*\.?[0-9]*(e[-+]?)?[0-9]*$/i,
				onBlur: "validate",
				saveKey: F.ui.keyCode.ENTER,
				onSave: "nextFocus",
				onTab: "nextFocus",
				allowInvalid: !1,
				invalidClass: "pq-cell-red-tr pq-has-tooltip",
				warnClass: "pq-cell-blue-tr pq-has-tooltip",
				validate: !0
			},
			editor: {
				select: !1,
				type: "contenteditable"
			},
			summaryOptions: {
				number: "avg,max,min,stdev,stdevp,sum",
				date: "count,max,min",
				string: "count"
			},
			summaryTitle: {
				avg: "Avg: {0}",
				count: "Count: {0}",
				max: "Max: {0}",
				min: "Min: {0}",
				stdev: "Stdev: {0}",
				stdevp: "Stdevp: {0}",
				sum: "Sum: {0}"
			},
			validation: {
				icon: "ui-icon-alert",
				cls: "ui-state-error",
				style: "padding:3px 10px;"
			},
			warning: {
				icon: "ui-icon-info",
				cls: "",
				style: "padding:3px 10px;"
			},
			freezeCols: 0,
			freezeRows: 0,
			freezeBorders: !0,
			height: 400,
			hoverMode: "null",
			locale: "en",
			maxColWidth: 2e3,
			minColWidth: 50,
			minWidth: 100,
			menuUI: {
				tabs: ["hideCols", "filter", "export"],
				buttons: ["clear", "ok"],
				gridOptions: {
					autoRow: !1,
					copyModel: {
						render: !0
					},
					editable: function(t) {
						return !t.rowData.pq_disabled
					},
					fillHandle: "",
					filterModel: {
						header: !0,
						on: !0
					},
					hoverMode: "row",
					hwrap: !1,
					wrap: !1,
					rowBorders: !1,
					hideVScroll: !0,
					scrollModel: {
						autoFit: !0
					},
					showTop: !1,
					height: 300
				}
			},
			mergeCells: [],
			numberCell: {
				width: 30,
				title: "",
				resizable: !0,
				minWidth: 30,
				maxWidth: 100,
				show: !0,
				menuUI: {
					tabs: ["hideCols", "export"]
				}
			},
			pageModel: {
				curPage: 1,
				totalPages: 0,
				rPP: 10,
				rPPOptions: [10, 20, 50, 100]
			},
			refreshCompareBy: "value",
			resizable: !1,
			rowBorders: !0,
			rowResize: !0,
			autoRow: !0,
			scrollModel: {
				autoFit: !1
			},
			selectionModel: {
				column: !0,
				type: "cell",
				onTab: "nextFocus",
				row: !0,
				mode: "block"
			},
			showBottom: !0,
			showHeader: !0,
			showTitle: !0,
			showToolbar: !0,
			showTop: !0,
			sortable: !0,
			sql: !1,
			stringify: !0,
			stripeRows: !0,
			title: "&nbsp;",
			toolPanelRules: {},
			treeModel: null,
			width: "auto",
			wrap: !0,
			hwrap: !1
		}, F.widget("paramquery._pqGrid", F.ui.mouse, e), P._pqGrid.prototype);

	function i(t) {
		return "<span class='ui-widget-header pq-ui-button'><span class='ui-icon ui-icon-" + t + "'></span></span>"
	}
	A.setData = function(t) {
		var e = this.options,
			n = e.groupModel.pivot,
			e = e.reactive,
			i = this.Group();
		n && i.option({
			pivot: !1
		}), this.option("dataModel.data", t), e || this.refreshDataAndView(), n && i.option({
			pivot: !0
		})
	}, A.refreshCM = function(t, e) {
		t && (this.options.colModel = t), this.iCols.init(e)
	}, A.evtBelongs = function(t) {
		return F(t.target).closest(".pq-grid")[0] == this.element[0]
	}, A.readCell = function(t, e, n, i, r) {
		if (!n || !1 !== n.isRootCell(i, r, "o")) return t[e.dataIndx]
	}, A.saveCell = function(t, e, n) {
		t[e.dataIndx] = n
	}, A._destroyResizable = function() {
		var t = this.element,
			e = t.data();
		(e.resizable || e.uiResizable || e["ui-resizable"]) && t.resizable("destroy")
	}, A._disable = function() {
		null == this.$disable && (this.$disable = F("<div class='pq-grid-disable'></div>").css("opacity", .2).appendTo(this.element))
	}, A._enable = function() {
		this.$disable && (this.element[0].removeChild(this.$disable[0]), this.$disable = null)
	}, A._destroy = function() {
		var t = this.element,
			e = this.eventNamespace;
		this._destroyResizable(), this._destroyDraggable(), t.off(e), F(window).off(e), F(document).off(e), t.empty().css("height", "").css("width", "").removeClass("pq-grid ui-widget ui-widget-content ui-corner-all").removeData()
	}, A._onKeyUp = function(e) {
		return function(t) {
			e.evtBelongs(t) && e._trigger("keyUp", t, null)
		}
	}, A.onKeyDown = function(t) {
		if (F(t.target).closest(".pq-header-outer").length) return this._trigger("headerKeyDown", t, null);
		!1 !== this.iKeyNav.bodyKeyDown(t) && this._trigger("keyDown", t, null)
	}, A._onKeyDown = function(e) {
		return function(t) {
			e.evtBelongs(t) && e.onKeyDown(t, e)
		}
	}, A.collapse = function(t) {
		t = t || {};

		function e() {
			i.css("overflow", "hidden"), o.addClass("ui-icon-circle-triangle-s").removeClass("ui-icon-circle-triangle-n"), i.hasClass("ui-resizable") && i.resizable("destroy"), n._toolbar && n._toolbar.disable(), r.collapsed = r._collapsed = !0, r.animating = !1, n._trigger("collapse")
		}
		var n = this,
			i = n.element,
			r = n.options.collapsible,
			o = r.$collapse.children("span");
		if (r._collapsed) return !1;
		r.htCapture = i.height(), !1 === t.animate ? (i.height(23), e()) : (r.animating = !0, n.disable(), i.animate({
			height: "23px"
		}, function() {
			e()
		}))
	}, A.expand = function(t) {
		function e() {
			i.css("overflow", ""), r._collapsed = r.collapsed = !1, n._refreshResizable(), r.refreshAfterExpand && n.refresh(), a.addClass("ui-icon-circle-triangle-n").removeClass("ui-icon-circle-triangle-s"), n._toolbar && n._toolbar.enable(), n.enable(), r.animating = !1, n._trigger("expand")
		}
		var n = this,
			i = n.element,
			r = n.options.collapsible,
			o = r.htCapture,
			a = r.$collapse.children("span");
		if (!1 === r._collapsed) return !1;
		!1 === (t = t || {}).animate ? (i.height(o), e()) : (r.animating = !0, i.animate({
			height: o
		}, function() {
			e()
		}))
	}, A._createCollapse = function() {
		var t = this,
			e = this.$top,
			n = this.options.collapsible;
		n.$stripe || (e = F(["<div class='pq-slider-icon pq-no-capture'  >", "</div>"].join("")).appendTo(e), n.$stripe = e), n.on ? n.$collapse || (n.$collapse = F(i("circle-triangle-n")).appendTo(n.$stripe).click(function() {
			n.collapsed ? t.expand() : t.collapse()
		})) : n.$collapse && (n.$collapse.remove(), delete n.$collapse), n.collapsed && !n._collapsed ? t.collapse({
			animate: !1
		}) : !n.collapsed && n._collapsed && t.expand({
			animate: !1
		}), n.toggle ? n.$toggle || (n.$toggle = F(i("arrow-4-diag")).prependTo(n.$stripe).click(function() {
			t.toggle()
		})) : n.$toggle && (n.$toggle.remove(), delete n.$toggle), n.toggled && !n.state && this.toggle()
	}, A.toggle = function(t) {
		t = t || {};
		var e, n, i = this.options,
			r = i.collapsible,
			o = this.element,
			a = r.state,
			l = a ? "min" : "max",
			s = F("html"),
			d = F(window),
			c = F(document.body);
		if (!1 === this._trigger("beforeToggle", null, {
				state: l
			})) return !1;
		"min" == l ? (e = a.grid, n = a.doc, this.option({
			height: e.height,
			width: e.width,
			maxHeight: e.maxHeight,
			maxWidth: e.maxWidth
		}), o[0].style.cssText = e.cssText, c[0].style.cssText = n.cssText, s.css({
			overflow: "visible"
		}), window.scrollTo(n.scrollLeft, n.scrollTop), r.state = null) : (e = {
			height: i.height,
			width: i.width,
			cssText: o[0].style.cssText,
			maxHeight: i.maxHeight,
			maxWidth: i.maxWidth
		}, this.option({
			height: "100%",
			width: "100%",
			maxHeight: null,
			maxWidth: null
		}), o.css(F.extend({
			position: "fixed",
			left: 0,
			top: 0,
			margin: 0
		}, r.css)), n = {
			scrollLeft: d.scrollLeft(),
			scrollTop: d.scrollTop(),
			cssText: c[0].style.cssText
		}, c.css({
			height: 0,
			width: 0,
			overflow: "hidden",
			position: "static"
		}), s.css({
			overflow: "hidden"
		}), window.scrollTo(0, 0), r.state = {
			grid: e,
			doc: n
		}), r.toggled = !!r.state, t.refresh || (this._trigger("toggle", null, {
			state: l
		}), this._refreshResizable(), this.refresh(), d.trigger("resize", {
			$grid: o,
			state: l
		}))
	}, A._onDblClickCell = function(t) {
		var e = this,
			n = F(t.currentTarget),
			i = e.getCellIndices({
				$td: n
			});
		i.$td = n, 0 != e._trigger("cellDblClick", t, i) && (1 < e.options.editModel.clicksToEdit && e.isEditable(i) && e.editCell(i), i.$tr = n.closest(".pq-grid-row"), e._trigger("rowDblClick", t, i))
	}, A.getValueFromDataType = function(t, e, n) {
		if ("=" == (t + "")[0]) return t;
		var i;
		if ("date" == e) return i = Date.parse(t), isNaN(i) ? void 0 : n ? i : t;
		if ("integer" == e) i = parseInt(t);
		else {
			if ("float" != e) return "bool" == e ? null == t ? t : 0 == (i = F.trim(t).toLowerCase()).length ? null : "true" == i || "yes" == i || "1" == i || "false" != i && "no" != i && "0" != i && Boolean(i) : "object" == e || null == t ? t : F.trim(t);
			i = parseFloat(t)
		}
		return isNaN(i) || null == i ? null == t ? t : null : i
	}, A.isValid = function(t) {
		return this.iValid.isValid(t)
	}, A.isValidChange = function(t) {
		t = t || {};
		var e = this.getChanges(),
			n = e.addList,
			e = e.updateList.concat(n);
		return t.data = e, this.isValid(t)
	}, A.isEditableCell = function(t) {
		var e, t = this.normalize(t),
			n = t.rowData;
		return e = null == (e = n && (n = n.pq_cellprop) ? (n[t.dataIndx] || {}).edit : e) && null != (n = t.column.editable) ? pq.isFn(n) ? n.call(this, t) : n : e
	}, A.isEditableRow = function(t) {
		var e = this.options.editable,
			n = t.rowData,
			n = n && (n.pq_rowprop || {}).edit;
		return n = null == n ? pq.isFn(e) ? e.call(this, this.normalize(t)) : e : n
	}, A.isEditable = function(t) {
		var e = this.isEditableCell(t);
		return null == e ? this.isEditableRow(t) : e
	}, A._onMouseDownCont = function(t, e) {
		F(t.target).is(".pq-cont-inner") && (this.focus({
			evt: t,
			body: !0
		}), t.preventDefault())
	}, A._onGCMouseDown = function() {
		var e = this;
		e._mousePQUpDelegate = function(t) {
			F(document).off("mouseup" + e.eventNamespace, e._mousePQUpDelegate), e._trigger("mousePQUp", t, null)
		}, F(document).on("mouseup" + e.eventNamespace, e._mousePQUpDelegate)
	}, A._onMouseDown = function(t) {
		var e, n;
		this.evtBelongs(t) && (n = (e = F(t.target)).closest(".pq-grid-cell,.pq-grid-number-cell")[0], e.is("a") || (n && (t.currentTarget = n, this._onMouseDownCell(t)), t.isPropagationStopped() || ((e = e.closest(".pq-grid-row")[0]) && (t.currentTarget = e, this._onMouseDownRow(t)), t.isPropagationStopped() || this._onMouseDownCont(t, n))))
	}, A._onMouseDownCell = function(t) {
		var e = F(t.currentTarget),
			n = this.getCellIndices({
				$td: e
			});
		null != n.rowIndx && ((n = this.iMerge.getRootCellO(n.rowIndx, n.colIndx, !0)).$td = e, this._trigger("cellMouseDown", t, n))
	}, A._onMouseDownRow = function(t) {
		var e = F(t.currentTarget),
			n = this.getRowIndx({
				$tr: e
			});
		n.$tr = e, this._trigger("rowMouseDown", t, n)
	}, A._onCellMouseEnter = function(r) {
		return function(t) {
			if (r.evtBelongs(t)) {
				var e = F(this),
					n = r.options,
					i = r.getCellIndices({
						$td: e
					});
				if (null != i.rowIndx && null != i.colIndx && !1 !== r._trigger("cellMouseEnter", t, i)) return "cell" == n.hoverMode && r.highlightCell(e), !0
			}
		}
	}, A._onChange = function(i) {
		var e, r, o;

		function a() {
			if (e && r && r.target == e.target) {
				for (var t in {
						ctrlKey: 0,
						metaKey: 0,
						shiftKey: 0,
						altKey: 0
					}) r[t] = e[t];
				i._trigger("valChange", r, o), r = e = void 0
			}
		}
		return i.on("cellClickDone", function(t) {
				e = t.originalEvent, a()
			}),
			function(t) {
				var e, n;
				i.evtBelongs(t) && (n = (e = F(t.target)).closest(".pq-grid-cell")).length && (o = i.getCellIndices({
					$td: n
				}), (o = i.normalize(o)).input = e[0], r = t, a())
			}
	}, A._onRowMouseEnter = function(r) {
		return function(t) {
			if (r.evtBelongs(t)) {
				var e = F(this),
					n = r.options,
					e = r.getRowIndx({
						$tr: e
					}),
					i = e.rowIndxPage;
				if (!1 !== r._trigger("rowMouseEnter", t, e)) return "row" == n.hoverMode && r.highlightRow(i), !0
			}
		}
	}, A._onCellMouseLeave = function(e) {
		return function(t) {
			e.evtBelongs(t) && (t = F(this), "cell" == e.options.hoverMode && e.unHighlightCell(t))
		}
	}, A._onRowMouseLeave = function(r) {
		return function(t) {
			var e, n, i;
			r.evtBelongs(t) && (e = F(this), i = (n = r.getRowIndx({
				$tr: e
			})).rowIndxPage, !1 !== r._trigger("rowMouseLeave", t, {
				$tr: e,
				rowIndx: n.rowIndx,
				rowIndxPage: i
			}) && "row" == r.options.hoverMode && r.unHighlightRow(i))
		}
	}, A.enableSelection = function() {
		this.element.removeClass("pq-disable-select").off("selectstart" + this.eventNamespace)
	}, A.disableSelection = function() {
		this.element.addClass("pq-disable-select").on("selectstart" + this.eventNamespace, function(t) {
			var e = t.target,
				n = F(e);
			if (e) return !!n.is("input,textarea,select,[contenteditable=true]") || (!!n.closest(".pq-native-select").length || void t.preventDefault())
		})
	}, A._onClickCell = function(t) {
		var e = this,
			n = e.options.editModel,
			i = F(t.currentTarget),
			r = e.getCellIndices({
				$td: i
			}),
			r = e.normalize(r),
			o = r.colIndx;
		r.$td = i, r.evt = t, 0 != e._trigger("beforeCellClick", t, r) && (e._trigger("cellClick", t, r), e._trigger("cellClickE", t, r), null == o || o < 0 || (1 == n.clicksToEdit && e.isEditable(r) && e.editCell(r), r.$tr = i.closest(".pq-grid-row"), e._trigger("rowClick", t, r)))
	}, A._getHeadIndices = function(t, e) {
		var n = this.headerCells;
		return {
			ri: t = null == t ? n.length - 1 : t,
			colIndx: e,
			column: (n[t] || n[t - 1])[e],
			filterRow: !n[t]
		}
	}, A.getHeadIndices = function(t) {
		t = this.iRenderB.getCellIndx(t);
		return this._getHeadIndices(t[0], t[1])
	}, A.onContext = function(e) {
		function t(t) {
			a._trigger(t, e, o)
		}
		var n, i, r, o, a = this,
			l = e.target;
		if (a.evtBelongs(e)) {
			i = l;
			do {
				if (r = F(i), o = {
						ele: i
					}, r.is(".pq-grid")) {
					o = {}, t("context");
					break
				}
				if (r.is(".pq-cont-inner") ? (o.type = "body", n = 1) : r.is("img") ? (o.type = "img", n = 1) : r.is(".pq-grid-cell,.pq-grid-number-cell") ? (o = a.getCellIndices({
						$td: r
					})).rowData && (o.type = o.column ? "cell" : "num", o.$td = r, n = 1, t("cellRightClick")) : r.is(".pq-grid-col") && ((o = a.getHeadIndices(i)).type = "head", o.$th = r, n = 1, t("headRightClick")), n) {
					t("context");
					break
				}
			} while (i = i.parentNode)
		}
	}, A.highlightCell = function(t) {
		t.addClass("pq-grid-cell-hover ui-state-hover")
	}, A.unHighlightCell = function(t) {
		t.removeClass("pq-grid-cell-hover ui-state-hover")
	}, A.highlightRow = function(t) {
		isNaN(t) || (t = this.getRow({
			rowIndxPage: t
		})) && t.addClass("pq-grid-row-hover ui-state-hover")
	}, A.unHighlightRow = function(t) {
		isNaN(t) || (t = this.getRow({
			rowIndxPage: t
		})) && t.removeClass("pq-grid-row-hover ui-state-hover")
	}, A._getCreateEventData = function() {
		return {
			dataModel: this.options.dataModel,
			data: this.pdata,
			colModel: this.options.colModel
		}
	}, A._initPager = function() {
		var t, i = this,
			e = i.options,
			n = e.pageModel;
		n.type && (t = {
			bootstrap: e.bootstrap,
			change: function(t, e) {
				i.blurEditor({
					force: !0
				});
				var n = i.options.pageModel;
				null != e.curPage && (n.prevPage = n.curPage, n.curPage = e.curPage), null != e.rPP && (n.rPP = e.rPP), "remote" == n.type ? i.remoteRequest({
					callback: function() {
						i._onDataAvailable({
							apply: !0,
							header: !1
						})
					}
				}) : i.refreshView({
					header: !1,
					source: "pager"
				})
			},
			refresh: function() {
				i.refreshDataAndView()
			}
		}, (t = F.extend(t, n)).rtl = e.rtl, i.pageI = pq.pager(n.appendTo || this.$footer, t).on("destroy", function() {
			delete i.pageI
		}))
	}, A.generateLoading = function() {
		this.$loading && this.$loading.remove(), this.$loading = F("<div class='pq-loading'></div>").appendTo(this.element), F(["<div class='pq-loading-bg'></div><div class='pq-loading-mask ui-state-highlight'><div>", this.options.strLoading, "...</div></div>"].join("")).appendTo(this.$loading), this.$loading.find("div.pq-loading-bg").css("opacity", .2)
	}, A._refreshLoadingString = function() {
		this.$loading.find("div.pq-loading-mask").children("div").html(this.options.strLoading)
	}, A.showLoading = function() {
		this.loading = !0, this.$loading.show()
	}, A.hideLoading = function() {
		this.loading = !1, this.$loading.hide()
	}, A.getTotalRows = function() {
		var t = this.options,
			e = t.dataModel,
			n = e.data || [],
			e = e.dataUF || [],
			t = t.pageModel;
		return "remote" == t.location ? t.totalRecords : n.length + e.length
	}, A.refreshDataFromDataModel = function(t) {
		t = t || {};
		var e, n, i, r, o, a = this,
			l = a.options,
			s = l.dataModel,
			d = l.pageModel,
			s = s.data,
			c = d.type,
			u = a._queueATriggers;
		if (a._trigger("beforeRefreshData", null, {}), "local" == c ? (r = d.totalRecords = s.length, d.totalPages = r = Math.ceil(r / d.rPP), d.curPage > r && (d.curPage = r), r && !d.curPage && (d.curPage = 1), o = (d.curPage - 1) * d.rPP, (i = d.curPage * d.rPP) > s.length && (i = s.length), a.pdata = s.slice(o = 0 <= o ? o : 0, i), o = o) : "remote" == c ? (d.totalPages = r = Math.ceil(d.totalRecords / d.rPP), d.curPage > r && (d.curPage = r), r && !d.curPage && (d.curPage = 1), (i = d.rPP) > s.length && (i = s.length), a.pdata = s.slice(0, i), o = d.rPP * (d.curPage - 1)) : l.backwardCompat ? a.pdata = s.slice(0) : a.pdata = s, a.riOffset = 0 <= o ? o : 0, a._trigger("dataReady", null, t), a._trigger("dataReadyAfter", null, t), 0 != t.triggerQueue)
			for (e in u) n = u[e], delete u[e], a._trigger(e, n.evt, n.ui)
	}, A.getQueryString = function(t) {
		t = t || {};
		var e = this,
			n = "",
			i = "",
			r = e.options,
			o = r.dataModel,
			a = r.sortModel,
			l = r.filterModel,
			s = r.pageModel,
			d = {},
			c = {},
			u = {};
		return pq.isFn(o.getUrl) ? (r = {
			colModel: e.colModel,
			dataModel: o,
			sortModel: a,
			groupModel: r.groupModel,
			pageModel: s,
			filterModel: l
		}, (r = o.getUrl.call(e, r)) && r.url && (n = r.url), r && r.data && (i = r.data)) : pq.isStr(o.url) && (n = o.url, "remote" == a.type && (t.initBySort || e.sort({
			initByRemote: !0
		}), (r = e.iSort.getQueryStringSort()) && (d = {
			pq_sort: r
		})), "remote" == s.type && (u = {
			pq_curpage: s.curPage,
			pq_rpp: s.rPP
		}), "local" != l.type && (a = e.iFilterData.getQueryStringFilter()) && (e._queueATriggers.filter = {
			ui: {}
		}, c = {
			pq_filter: a
		}), i = F.extend({
			pq_datatype: o.dataType
		}, c, u, d, e.postData(o), o.postDataOnce)), {
			url: n,
			dataURL: i
		}
	}, A.postData = function(t) {
		var e = t.postData;
		return e = pq.isFn(e) ? e.call(this, {
			colModel: this.colModel,
			dataModel: t
		}) : e
	}, A.callXHR = function(t, e, i) {
		var r = this,
			o = r.options.dataModel;
		r.xhr = F.ajax(Object.assign({}, o.ajaxOptions, {
			url: t,
			dataType: o.dataType,
			async: o.async,
			cache: o.cache,
			contentType: o.contentType,
			type: o.method,
			data: e,
			beforeSend: o.beforeSend.bind(r),
			success: function(t, e, n) {
				t = o.getData.call(r, t, e, n), i(t, e, n)
			},
			error: function(t, e, n) {
				if (r.hideLoading(), pq.isFn(o.error)) o.error.call(r, t, e, n);
				else if ("abort" != n) throw "Error : " + n
			}
		}))
	}, A.remoteRequest = function(i) {
		i = i || {};
		var r = this,
			t = r.getQueryString(i),
			e = t.url,
			t = t.dataURL;
		r.loading && r.xhr.abort(), e && (r.showLoading(), r.callXHR(e, t, function(t, e, n) {
			r.onRemoteSuccess(t, e, n, i)
		}))
	}, A.onRemoteSuccess = function(t, e, n, i) {
		var r, o, a;
		this.element && (a = this.options, r = this.colModel, o = a.pageModel, (a = a.dataModel).data = t.data, "remote" == o.type && (null != t.curPage && (o.curPage = t.curPage), null != t.totalRecords && (o.totalRecords = t.totalRecords)), this.hideLoading(), this._trigger("load", null, {
			dataModel: a,
			colModel: r
		}), i.callback && i.callback())
	}, A._refreshTitle = function() {
		this.$title.html(this.options.title)
	}, A._destroyDraggable = function() {
		var t = this.element,
			e = t.parent(".pq-wrapper");
		e.length && e.data("draggable") && (e.draggable("destroy"), this.$title.removeClass("pq-draggable pq-no-capture"), t.unwrap(".pq-wrapper"))
	}, A._refreshDraggable = function() {
		var t = this.options,
			e = this.element,
			n = this.$title;
		t.draggable ? (n.addClass("pq-draggable pq-no-capture"), e.parent(".pq-wrapper").length || e.wrap("<div class='pq-wrapper' />"), e.parent(".pq-wrapper").draggable({
			handle: n
		})) : this._destroyDraggable()
	}, A._refreshResizable = function() {
		var t, s = this,
			e = this.element,
			d = this.options,
			n = -1 < (d.width + "").indexOf("%"),
			i = -1 < (d.height + "").indexOf("%"),
			r = "auto" == d.width,
			o = "flex" == d.width,
			a = "flex" == d.height;
		!d.resizable || (a || i) && (o || n || r) ? this._destroyResizable() : (t = "e,s,se", a || i ? t = "e" : (o || n || r) && (t = "s"), a = !0, e.hasClass("ui-resizable") && (t == e.resizable("option", "handles") ? a = !1 : this._destroyResizable()), a && e.resizable({
			helper: "ui-state-default",
			handles: t,
			minWidth: d.minWidth,
			minHeight: d.minHeight || 100,
			delay: 0,
			start: function(t, e) {
				F(e.helper).css({
					opacity: .5,
					background: "#ccc",
					border: "1px solid steelblue"
				})
			},
			stop: function() {
				var t = s.element,
					e = t[0],
					n = d.width,
					i = d.height,
					r = -1 < (n + "").indexOf("%"),
					o = -1 < (i + "").indexOf("%"),
					a = "auto" == n,
					n = "flex" == n,
					i = "flex" == i,
					l = !1;
				e.style.width = e.offsetWidth + 3 + "px", e.style.height = e.offsetHeight + 3 + "px", o || i || (l = !0, d.height = e.offsetHeight), r || a || n || (l = !0, d.width = e.offsetWidth), s.refresh({
					soft: !0
				}), t.css("position", "relative"), l && F(window).trigger("resize")
			}
		}))
	}, A.refresh = function(t) {
		this.iRefresh.refresh(t)
	}, A.refreshView = function(t) {
		null != this.options.editModel.indices && this.blurEditor({
			force: !0
		}), this.refreshDataFromDataModel(t), this.refresh(t)
	}, A._refreshPager = function() {
		var t = this,
			e = t.options,
			n = e.pageModel,
			i = !!n.type,
			r = n.rPP,
			o = n.totalRecords;
		i ? (t.pageI || t._initPager(), t.pageI.option(n), r < o ? t.$bottom.css("display", "") : e.showBottom || t.$bottom.css("display", "none")) : (t.pageI && t.pageI.destroy(), e.showBottom ? t.$bottom.css("display", "") : t.$bottom.css("display", "none"))
	}, A.refreshDataAndView = function(t) {
		t = t || {};
		var e = this,
			n = e.options.dataModel.location,
			i = "lazy" == n;
		0 != e._trigger("beforeNewData", null, t) && (e.pdata = [], "remote" == n ? e.remoteRequest({
			callback: function() {
				e._onDataAvailable(t)
			}
		}) : (e._onDataAvailable(i ? F.extend({}, t, {
			sort: !1,
			filter: !1,
			group: !1,
			trigger: !1
		}) : t), i && e.iLazy.init(t)))
	}, A.getColIndx = function(t) {
		var e = t.dataIndx,
			n = t.column,
			i = this.colModel,
			r = i.length,
			o = 0;
		if (n) {
			for (; o < r; o++)
				if (i[o] == n) return o
		} else {
			if (null == e) throw "dataIndx / column NA";
			if (null != (t = this.colIndxs[e])) return t
		}
		return -1
	}, A.getColumn = function(t) {
		t = t.dataIndx;
		if (null == t) throw "dataIndx N/A";
		return this.columns[t] || this.iGroup.getColsPrimary()[t]
	}, A._removeEditOutline = function() {
		var t, e, n = this,
			i = n.$div_focus;
		i && (t = i.find(".pq-editor-focus"), (e = t).hasClass("hasDatepicker") && e.datepicker("hide").datepicker("destroy"), t[0] == document.activeElement && (e = n._blurEditMode, n._blurEditMode = !0, t.blur(), n._blurEditMode = e), i.removeAttr("title").empty(), i.parent()[0] == n.element[0] && i.remove(), delete n.$div_focus, t = n.options.editModel, e = F.extend({}, t.indices), t.indices = null, e.rowData = void 0, n.refreshCell(e))
	}, A.scrollX = function(t, e) {
		var n = this;
		return n.iRenderB.scrollX(t, function() {
			e && e.call(n)
		})
	}, A.scrollY = function(t, e) {
		var n = this;
		return n.iRenderB.scrollY(t, function() {
			e && e.call(n)
		})
	}, A.scrollXY = function(t, e, n) {
		var i = this;
		return i.iRenderB.scrollXY(t, e, function() {
			n && n.call(i)
		})
	}, A.scrollRow = function(t, e) {
		var n = this;
		n.iRenderB.scrollRow(n.normalize(t).rowIndxPage, function() {
			e && e.call(n)
		})
	}, A.scrollColumn = function(t, e) {
		var n = this;
		n.iRenderB.scrollColumn(n.normalize(t).colIndx, function() {
			e && e.call(n)
		})
	}, A.scrollCell = function(t, e) {
		var n = this,
			t = n.normalize(t);
		n.iRenderB.scrollCell(t.rowIndxPage, t.colIndx, function() {
			e && e.call(n), n._trigger("scrollCell")
		})
	}, A.blurEditor = function(t) {
		if (this.$div_focus) {
			var e = this.$div_focus.find(".pq-editor-focus");
			if (!t || !t.blurIfFocus) return e.triggerHandler("blur", t);
			document.activeElement == e[0] && e.blur()
		}
	}, A.Selection = function() {
		return this.iSelection
	}, A.goToPage = function(t) {
		var e, n, i = this.options.pageModel;
		"local" != i.type && "remote" != i.type || (n = t.rowIndx, e = i.rPP, (n = null == t.page ? Math.ceil((n + 1) / e) : t.page) != i.curPage && (i.curPage = n, "local" == i.type ? this.refreshView() : this.refreshDataAndView()))
	}, A.setSelection = function(t, e) {
		if (null == t) return this.iSelection.removeAll(), this.iRows.removeAll({
			all: !0
		}), !0;

		function n() {
			null != a && !1 !== t.focus && i.focus({
				rowIndxPage: a,
				colIndx: null == l ? i.getFirstVisibleCI() : l
			}), e && e.call(i)
		}
		var i = this,
			r = i.pdata,
			o = (r && r.length || n(), (t = this.normalize(t)).rowIndx),
			a = t.rowIndxPage,
			l = t.colIndx;
		(null == o || o < 0 || l < 0 || l >= this.colModel.length) && n(), this.goToPage(t), a = o - this.riOffset, i.scrollRow({
			rowIndxPage: a
		}, function() {
			null == l ? (i.iRows.add({
				rowIndx: o
			}), n()) : i.scrollColumn({
				colIndx: l
			}, function() {
				i.Range({
					r1: o,
					c1: l
				}).select(), n()
			})
		})
	}, A.getColModel = function() {
		return this.colModel
	}, A.getCMPrimary = function() {
		return this.iGroup.getCMPrimary()
	}, A.getOCMPrimary = function() {
		return this.iGroup.getOCMPrimary()
	}, A.saveEditCell = function(t) {
		var e = this.options,
			n = e.editModel;
		if (!n.indices) return null;
		var i, n = F.extend({}, n.indices),
			t = t ? t.evt : null,
			r = this.riOffset,
			o = n.colIndx,
			n = n.rowIndxPage,
			r = n + r,
			o = this.colModel[o],
			a = o.dataIndx,
			l = this.pdata[n],
			e = e.dataModel;
		if (null == l) return null;
		if (null != n) {
			var s = this.getEditCellData();
			if (F.isPlainObject(s))
				for (var d in i = {}, s) i[d] = l[d];
			else i = this.readCell(l, o);
			"<br>" == s && (s = "");
			n = {
				rowIndx: r,
				rowIndxPage: n,
				dataIndx: a,
				column: o,
				newVal: s = null == i && "" === s ? null : s,
				value: s,
				oldVal: i,
				rowData: l,
				dataModel: e
			};
			if (!1 === this._trigger("cellBeforeSave", t, n)) return !1;
			o = {};
			return F.isPlainObject(s) ? o = s : o[a] = s, !1 === this.updateRow({
				row: o,
				rowIndx: r,
				silent: !0,
				source: "edit",
				checkEditable: !1
			}) ? !1 : (this._trigger("cellSave", t, n), !0)
		}
	}, A._digestNewRow = function(t, e, n, i, r, o, a, l, s) {
		var d, c, u = this.getValueFromDataType,
			h = this.columns,
			f = this.colIndxs;
		for (d in t)
			if (c = h[d], p = f[d], c) {
				if (o && !1 === this.isEditable({
						rowIndx: n,
						rowData: i,
						colIndx: p,
						column: c
					})) delete t[d], e && delete e[d];
				else {
					var p = c.dataType,
						g = u(t[d], p),
						m = void 0 !== (m = e ? e[d] : void 0) ? u(m, p) : void 0;
					if (t[d] = g, "update" != r || w(g, i, e) || w(m, t, i), a && c.validations)
						if ("edit" == s && !1 === l) {
							var v = this.isValid({
								focusInvalid: !0,
								dataIndx: d,
								rowIndx: n,
								value: g
							});
							if (0 == v.valid && !v.warn) return !1
						} else !1 !== (v = this.iValid.isValidCell({
							column: c,
							rowData: "add" == r ? t : i,
							allowInvalid: l,
							value: g
						})).valid || !1 !== l || v.warn || delete t[d];
					"update" == r && g === m && (delete t[d], delete e[d])
				}

				function w(t, e, n) {
					var i = "pq_cellprop";
					return null == t && (t = ((e[i] || {})[d] || {}).link) && ((n = (n = n[i] = n[i] || {})[d] = n[d] || {}).link = t, delete e.pq_cellprop[d].link, 1)
				}
			} return "update" != r || (!pq.isEmpty(t) || void 0)
	}, A._digestData = function(t) {
		if (t.rowList) throw "not supported";
		if (I = t.addList = t.addList || [], t.updateList = t.updateList || [], t.deleteList = t.deleteList || [], I.length && I[0].rowData) throw "rd in addList";
		if (!1 === this._trigger("beforeValidate", null, t)) return !1;
		for (var e, n, i, r = this, o = r.options, a = o.editModel, l = o.dataModel, s = l.data || [], l = l.dataUF || [], d = o.colModel, c = o.pageModel, u = o.historyModel, h = o.refreshCompareBy, f = r.iRenderB, $ = d.map(function(t) {
				return t.dataIndx
			}), p = (null == t.validate ? a : t).validate, d = "remote" == c.type, g = (null == t.allowInvalid ? a : t).allowInvalid, a = o.trackModel, m = t.track, u = null == t.history ? u.on : t.history, v = this.iHistory, w = this.iUCData, x = null == t.checkEditable || t.checkEditable, H = null == t.checkEditableAdd ? x : t.checkEditableAdd, y = t.source, C = r.iRefresh, b = this.riOffset, I = t.addList, q = t.updateList, _ = t.deleteList, R = [], D = [], m = null == m ? null == o.track ? a.on : o.track : m, M = 0, T = q.length; M < T; M++) {
			var S, k = q[M],
				E = k.newRow,
				O = k.rowData,
				F = k.checkEditable,
				P = k.rowIndx,
				A = k.oldRow;
			if (null == F && (F = x), !A) throw "oldRow required while update";
			if (!1 === (S = this._digestNewRow(E, A, P, O, "update", F, p, g, y))) return !1;
			S && D.push(k)
		}
		for (M = 0, T = I.length; M < T; M++) {
			if (k = I[M], E = k.newRow, F = k.checkEditable, P = k.rowIndx, null == F && (F = H), $.forEach(function(t) {
					E[t] = E[t]
				}), !1 === (S = this._digestNewRow(E, A, P, O, "add", F, p, g, y))) return !1;
			S && R.push(k)
		}
		return I = t.addList = R, a = (q = t.updateList = D).length, o = I.length, i = _.length, o || a || i ? (u && (v.increment(), v.push(t)), a && (!h || o || i || (e = f.saveValues(h)), r._digestUpdate(q, w, m)), i && (r._digestDelete(_, w, m, s, l, c, d, b), C.addRowIndx()), o && (r._digestAdd(I, w, m, s, c, d, b), C.addRT(I.map(function(t) {
			return t.newRow
		})), C.addRowIndx()), r._trigger("change", null, t), (n = e ? f.dirtyCells(e, h) : n) || !0) : "edit" == y && null
	}, A._digestUpdate = function(t, e, n) {
		for (var i, r, o = 0, a = t.length, l = this.columns, s = this.saveCell; o < a; o++) {
			var d = t[o],
				c = d.newRow,
				u = d.rowData;
			for (r in n && e.update({
					rowData: u,
					row: c,
					refresh: !1
				}), c)(i = l[r]) && s(u, i, c[r])
		}
	}, A._digestAdd = function(t, e, n, i, r, o, a) {
		var l = 0,
			s = t.length;
		for (t.sort(function(t, e) {
				return t.rowIndx - e.rowIndx
			}); l < s; l++) {
			var d = t[l],
				c = d.newRow,
				u = d.rowIndx;
			n && e.add({
				rowData: c
			}), null == u ? i.push(c) : i.splice(o ? u - a : u, 0, c), d.rowData = c, o && r.totalRecords++
		}
	}, A._digestDelete = function(t, e, n, i, r, o, a, l) {
		for (var s, d = 0, c = t.length; d < c; d++) {
			var u = t[d],
				h = u.rowData,
				f = !1,
				p = i.indexOf(h); - 1 == p ? 0 <= (p = r.indexOf(h)) && (f = !0) : u.rowIndx = a ? p + l : p, u.uf = f, u.indx = p
		}
		for (t.sort(function(t, e) {
				return e.rowIndx - t.rowIndx
			}), d = 0; d < c; d++) h = (u = t[d]).rowData, f = u.uf, s = u.rowIndx, p = u.indx, n && e.delete({
			rowIndx: s,
			rowData: h
		}), f ? r.splice(p, 1) : (s = i.splice(p, 1)) && s.length && a && o.totalRecords--
	}, A.refreshColumn = function(t) {
		var n = this,
			i = n.normalize(t),
			t = n.iRenderB;
		i.skip = !0, t.eachV(function(t, e) {
			i.rowIndxPage = e, n.refreshCell(i)
		}), n._trigger("refreshColumn", null, i)
	}, A.refreshCell = function(t) {
		var t = this.normalize(t),
			e = t.rowIndxPage,
			n = t.colIndx;
		this.iRenderB.refreshCell(e, n, t.rowData, t.column) && !t.skip && (this.refresh({
			soft: !0
		}), this._trigger("refreshCell", null, t))
	}, A.refreshHeaderCell = function(t) {
		var t = this.normalize(t),
			e = this.headerCells,
			n = e.length - 1,
			e = e[n];
		this.iRenderHead.refreshCell(n, t.colIndx, e, t.column)
	}, A.refreshRow = function(t) {
		var e, n;
		if (this.pdata) return e = (t = this.normalize(t)).rowIndx, n = t.rowIndxPage, (t = t.rowData) ? (this.iRenderB.refreshRow(n), this.refresh({
			soft: !0
		}), this._trigger("refreshRow", null, {
			rowData: t,
			rowIndx: e,
			rowIndxPage: n
		}), !0) : null
	}, A.quitEditMode = function(t) {
		var e, n, i, r, o, a;
		this._quitEditMode || (i = n = e = !1, o = (r = this.options.editModel).indices, this._quitEditMode = !(a = void 0), t && (e = t.old, n = t.silent, i = t.fireOnly, a = t.evt), o && (n || e || this._trigger("editorEnd", a, o), i || (this._removeEditOutline(t), r.indices = null)), this._quitEditMode = null)
	}, A.getViewPortRowsIndx = function() {
		return {
			beginIndx: this.initV,
			endIndx: this.finalV
		}
	}, A.getViewPortIndx = function() {
		var t = this.iRenderB;
		return {
			initV: t.initV,
			finalV: t.finalV,
			initH: t.initH,
			finalH: t.finalH
		}
	}, A.getRIOffset = function() {
		return this.riOffset
	}, A.getEditCell = function() {
		var t, e, n = this.options.editModel;
		return n.indices ? (n = this.getCell(n.indices), e = (t = this.$div_focus).find(".pq-editor-focus"), {
			$td: n,
			$cell: t,
			$editor: e
		}) : {}
	}, A.editCell = function(t) {
		var e, n = this,
			i = n.normalize(t),
			t = n.iMerge,
			r = i.rowIndx,
			o = i.colIndx;
		if (t.ismergedCell(r, o) && ((t = t.getRootCellO(r, o)).rowIndx != i.rowIndx || t.colIndx != i.colIndx)) return !1;
		n.scrollCell(i, function() {
			if ((e = n.getCell(i)) && e.length) return n._editCell(i)
		})
	}, A.getFirstEditableColIndx = function(t) {
		if (null == t.rowIndx) throw "rowIndx NA";
		for (var e = this.colModel, n = 0; n < e.length; n++)
			if (!e[n].hidden && (t.colIndx = n, this.isEditable(t))) return n;
		return -1
	}, A.editFirstCellInRow = function(t) {
		var t = this.normalize(t).rowIndx,
			e = this.getFirstEditableColIndx({
				rowIndx: t
			}); - 1 != e && this.editCell({
			rowIndx: t,
			colIndx: e
		})
	}, A.getEditor = function(t, e) {
		function n(t) {
			return pq.isFn(t) ? t.call(i, r) : t
		}
		var i = this,
			r = i.normalize(t),
			t = n(i.options.editor),
			o = n(r.column.editor),
			a = F.extend(!0, {}, t, 0 == o ? {
				type: !1
			} : o);
		return (e || ["attr", "cls", "style", "type", "options"]).forEach(function(t) {
			a[t] = n(a[t]) || ""
		}), a
	}, A._editCell = function(t) {
		var d = this,
			t = d.normalize(t),
			n = t.editByPress,
			e = t.evt,
			i = t.rowIndxPage,
			r = t.colIndx,
			o = d.pdata;
		if (!o || i >= o.length) return !1;
		var c = d.options,
			a = c.editModel,
			l = o[i],
			o = t.rowIndx,
			s = d.colModel[r],
			u = s.dataIndx,
			h = d.readCell(l, s),
			f = {
				rowIndx: o,
				rowIndxPage: i,
				cellData: h,
				rowData: l,
				dataIndx: u,
				colIndx: r,
				column: s
			},
			p = d.getEditor(f),
			g = p.type,
			m = "contenteditable" == g;
		if (0 != g) {
			if (a.indices) {
				var v, w = a.indices;
				if (w.rowIndxPage == i && w.colIndx == r) return (v = d.$div_focus.find(".pq-editor-focus"))[0].focus(), document.activeElement != v[0] && window.setTimeout(function() {
					v.focus()
				}, 0), !1;
				if (!1 === d.blurEditor({
						evt: e
					})) return !1;
				d.quitEditMode({
					evt: e
				})
			}
			n || d.focus(t), a.indices = {
				rowIndxPage: i,
				rowIndx: o,
				colIndx: r,
				column: s,
				dataIndx: u
			};
			var x, y = F(document.activeElement);
			"grid" == p.appendTo ? (x = F("<div></div>").appendTo(d.element)).append(y) : x = y.parent(), (d.$div_focus = x).addClass("pq-editor-outer"), x.addClass("pq-align-" + (s.align || "left")), f.$cell = x;
			var C, w = (null == t.select ? p : t).select,
				b = p.valueIndx,
				I = p.dataMap,
				q = p.mapIndices || {},
				t = "pq-editor-focus " + p.cls,
				_ = t + " pq-cell-editor ",
				R = p.attr,
				D = p.style,
				D = D ? "style='" + D + "'" : "",
				M = D,
				T = D,
				S = (f.cls = t, f.attr = R, d.iKeyNav.ignoreBlur(function() {
					var t, e;
					"checkbox" == g ? (t = p.subtype, C = "<input " + (h ? "checked='checked'" : "") + " class='" + _ + "' " + R + " " + T + " type=checkbox name='" + u + "' />", x.html(C), e = x.children("input"), "triple" == t && (e.pqval({
						val: h
					}), x.click(function() {
						F(this).children("input").pqval({
							incr: !0
						})
					}))) : "select" == g ? (t = p.options || [], e = [R, " class='", _, "' ", M, " name='", u, "'"].join(""), C = P.select({
						options: t,
						attr: e,
						prepend: p.prepend,
						labelIndx: p.labelIndx,
						valueIndx: b,
						groupIndx: p.groupIndx,
						dataMap: I
					}), x.empty(), F(C).appendTo(x).val(null != b && (q[b] || d.columns[b]) ? q[b] ? l[q[b]] : l[b] : h)) : "textarea" == g || "textbox" == g || m ? (y.addClass(_), y.attr(F.extend({
						name: u
					}, m ? {
						contentEditable: !0
					} : {
						readonly: !1
					})), n || y.val(h)) : g && x.html("<" + g + " class='" + _ + "' tabindex=0 " + R + " " + M + ">")
				}), f.$editor = v = x.children(".pq-editor-focus"), a.filterKeys),
				D = d.getCell(a.indices),
				t = s.editModel,
				k = (t && void 0 !== t.filterKeys && (S = t.filterKeys), "textarea" != g && "contenteditable" != g && D.empty(), {
					$cell: x,
					cellData: h,
					$editor: v,
					$td: D,
					dataIndx: u,
					column: s,
					colIndx: r,
					rowIndx: o,
					rowIndxPage: i,
					rowData: l,
					editor: p
				}),
				E = d.iKeyNav;
			d._trigger("editorBegin", e, k), a.indices = k, (v = x.children(".pq-editor-focus")).data({
				FK: S
			}).on("click", function() {
				F(this).focus(), d._trigger("editorClick", null, k)
			}).on("keydown", E.keyDownInEdit.bind(E)).on("keypress", function(t) {
				return E.keyPressInEdit(t, {
					FK: S
				})
			}).on("keyup", function(t) {
				return E.keyUpInEdit(t, {
					FK: S
				})
			}).on("blur", A._onBlur = function(t, e) {
				var n = c.editModel,
					i = n.onBlur,
					r = "save" == i,
					o = document.activeElement,
					a = F(t.target),
					l = "validate" == i,
					s = n.cancelBlurCls,
					e = !!e && e.force;
				if (!d._quitEditMode && !d._blurEditMode && n.indices) {
					if (!e) {
						if (!1 === d._trigger("editorBlur", t, k)) return;
						if (!i) return;
						if (a[0] == o) return;
						if (s && a.hasClass(s)) return;
						if (a.hasClass("pq-autocomplete-text")) {
							if (F("." + a.data("id")).is(":visible")) return
						} else if (a.hasClass("hasDatepicker")) {
							if (a.datepicker("widget").is(":visible")) return !1
						} else if (a.hasClass("ui-autocomplete-input")) {
							if (a.autocomplete("widget").is(":visible")) return
						} else if (a.hasClass("ui-multiselect")) {
							if (F(".ui-multiselect-menu").is(":visible") || F(o).closest(".ui-multiselect-menu").length) return
						} else if (a.hasClass("pq-select-button")) {
							if (F(".pq-select-menu").is(":visible") || F(o).closest(".pq-select-menu").length) return
						} else if (p.preventClose && p.preventClose.call(d, k)) return
					}
					d._blurEditMode = !0;
					n = e || r || !l;
					if (!d.saveEditCell({
							evt: t,
							silent: n
						}) && !e && l) return d._deleteBlurEditMode(), !1;
					d.quitEditMode({
						evt: t
					}), d._deleteBlurEditMode()
				}
			}).on("focus", function(t) {
				d._trigger("editorFocus", t, k)
			}), v.focus(), window.setTimeout(function() {
				!1 === F(document.activeElement).hasClass("pq-editor-focus") && (d.element ? d.element.find(".pq-editor-focus") : F()).focus()
			}), !n && w && v.select()
		}
	}, A._deleteBlurEditMode = function(t) {
		var e = this;
		t = t || {}, e._blurEditMode && (t.timer ? window.setTimeout(function() {
			delete e._blurEditMode
		}, 0) : delete e._blurEditMode)
	}, A.getRow = function(t) {
		t = this.normalize(t).rowIndxPage;
		return this.iRenderB.get$Row(t)
	}, A.getCell = function(t) {
		0 <= t.vci && (t.colIndx = this.iCols.getci(t.vci));
		var t = this.normalize(t),
			e = t.rowIndxPage,
			t = t.colIndx,
			e = this.iRenderB.getCell(e, t);
		return F(e)
	}, A.getCellHeader = function(t, e) {
		0 <= t.vci && (t.colIndx = this.iCols.getci(t.vci));
		var t = this.normalize(t),
			n = t.colIndx,
			t = null == (t = t.ri) ? this.headerCells.length - (e ? 0 : 1) : t,
			e = this.iRenderHead.getCell(t, n);
		return F(e)
	}, A.getCellSum = function(t, e) {
		return F(this.iRenderSum.getCell(t, e))
	}, A.getCellFilter = function(t) {
		return t.ri = null, this.getCellHeader(t, !0)
	}, A.getEditorIndices = function() {
		var t = this.options.editModel.indices;
		return t ? F.extend({}, t) : null
	}, A.getEditCellData = function() {
		var t = this.options.editModel.indices;
		if (!t) return null;
		var e = t.colIndx,
			e = this.colModel[e],
			n = this.getEditor(t),
			i = n.valueIndx,
			r = n.labelIndx,
			o = n.mapIndices || {},
			e = e.dataIndx,
			a = this.$div_focus,
			l = n.getData;
		if (l) s = this.callFn(l, t);
		else {
			l = n.type;
			if ("checkbox" == l) var t = a.children(),
				s = "triple" == n.subtype ? t.pqval() : !!t.is(":checked");
			else {
				t = a.find('*[name="' + e + '"]');
				if (t && t.length)
					if ("select" == l && null != i)
						if (o[i] || this.columns[i]) {
							(s = {})[o[i] || i] = t.val(), s[o[r] || r] = t.find("option:selected").text();
							var d = n.dataMap;
							if (d) {
								var c = t.find("option:selected").data("map");
								if (c)
									for (var u = 0; u < d.length; u++) {
										var h = d[u];
										s[o[h] || h] = c[h]
									}
							}
						} else s = t.val();
				else s = t.val();
				else(t = a.find(".pq-editor-focus")) && t.length && (s = t.val())
			}
		}
		return s
	}, A.getCellIndices = function(t) {
		var e, t = t.$td,
			n = {};
		return t && t.length && t.closest(".pq-body-outer")[0] == this.$cont[0] && (t = this.iRenderB.getCellIndx(t[0])) && (e = t[0] + this.riOffset, n = this.iMerge.getRootCellO(e, t[1], !0)), n
	}, A.getRowsByClass = function(t) {
		var e = this.options,
			n = e.dataModel,
			i = "remote" == e.pageModel.type,
			r = this.riOffset,
			o = n.data,
			a = [];
		if (null == o) return a;
		for (var l = 0, s = o.length; l < s; l++) {
			var d, c, u = o[l];
			u.pq_rowcls && (t.rowData = u, this.hasClass(t) && (c = (d = i ? l + r : l) - r, (u = {
				rowData: u
			}).rowIndx = d, u.rowIndxPage = c, a.push(u)))
		}
		return a
	}, A.getCellsByClass = function(t) {
		var e = this.options,
			n = e.dataModel,
			i = "remote" == e.pageModel.type,
			r = this.riOffset,
			o = n.data,
			a = [];
		if (null == o) return a;
		for (var l = 0, s = o.length; l < s; l++) {
			var d = o[l],
				c = i ? l + r : l,
				u = d.pq_cellcls;
			if (u)
				for (var h in u) {
					var h = {
						rowData: d,
						rowIndx: c,
						dataIndx: h,
						cls: t.cls
					};
					this.hasClass(h) && (h = this.normalize(h), a.push(h))
				}
		}
		return a
	}, A.data = function(t) {
		var e = t.colIndx,
			e = (null != e ? this.colModel[e] : t).dataIndx,
			n = t.data,
			i = !(null != n && !pq.isStr(n)),
			t = t.rowData || this.getRowData(t);
		if (!t) return {
			data: null
		};
		if (null == e) {
			var r = t.pq_rowdata;
			if (i) return {
				data: o = null != r ? null == n ? r : r[n] : o
			};
			r = F.extend(!0, t.pq_rowdata, n);
			t.pq_rowdata = r
		} else {
			var o, a = t.pq_celldata;
			if (i) return null != a && (i = a[e], o = null == n || null == i ? i : i[n]), {
				data: o
			};
			a || (t.pq_celldata = {}), r = F.extend(!0, t.pq_celldata[e], n), t.pq_celldata[e] = r
		}
	}, A.attr = function(t) {
		var e = t.rowIndx,
			n = t.colIndx,
			n = (null != n ? this.colModel[n] : t).dataIndx,
			i = t.attr,
			r = !(null != i && !pq.isStr(i)),
			o = t.refresh,
			t = t.rowData || this.getRowData(t);
		if (!t) return {
			attr: null
		};
		if (r || !1 === o || null != e || (e = this.getRowIndx({
				rowData: t
			}).rowIndx), null == n) {
			var a = t.pq_rowattr;
			if (r) return {
				attr: l = null != a ? null == i ? a : a[i] : l
			};
			a = F.extend(!0, t.pq_rowattr, i), t.pq_rowattr = a, !1 !== o && null != e && this.refreshRow({
				rowIndx: e
			})
		} else {
			var l, s = t.pq_cellattr;
			if (r) return null != s && (r = s[n], l = null == i || null == r ? r : r[i]), {
				attr: l
			};
			s || (t.pq_cellattr = {}), a = F.extend(!0, t.pq_cellattr[n], i), t.pq_cellattr[n] = a, !1 !== o && null != e && this.refreshCell({
				rowIndx: e,
				dataIndx: n
			})
		}
	}, A.processAttr = function(t, e) {
		var n, i, r = "";
		if (pq.isStr(t)) r = t;
		else if (t)
			for (n in t)
				if (i = t[n]) {
					if ("title" == n) i = i.replace(/"/g, "&quot;");
					else {
						if ("style" == n) {
							e && pq.styleObj(i, e);
							continue
						}
						"object" == typeof i && (i = JSON.stringify(i))
					}
					r += n + '="' + i + '"'
				} return r
	}, A.removeData = function(t) {
		var e = t.colIndx,
			e = (null != e ? this.colModel[e] : t).dataIndx,
			n = t.data,
			i = "string" == typeof(n = null == n ? [] : n) ? n.split(" ") : n,
			r = i.length,
			n = t.rowData || this.getRowData(t);
		if (n)
			if (null == e) {
				var o = n.pq_rowdata;
				if (o) {
					if (r)
						for (var a = 0; a < r; a++) delete o[i[a]];
					r && !F.isEmptyObject(o) || delete n.pq_rowdata
				}
			} else {
				t = n.pq_celldata;
				if (t && t[e]) {
					var l = t[e];
					if (r)
						for (a = 0; a < r; a++) delete l[i[a]];
					r && !F.isEmptyObject(l) || delete t[e]
				}
			}
	}, A.removeAttr = function(t) {
		var e = t.rowIndx,
			n = t.dataIndx,
			i = t.colIndx,
			n = null != i ? this.colModel[i].dataIndx : n,
			i = t.attr,
			r = "string" == typeof(i = null == i ? [] : i) ? i.split(" ") : i,
			o = r.length,
			a = e - this.riOffset,
			l = t.refresh,
			t = t.rowData || this.getRowData(t);
		if (t)
			if (!1 !== l && null == e && (e = this.getRowIndx({
					rowData: t
				}).rowIndx), null == n) {
				var s = t.pq_rowattr;
				if (s) {
					if (o)
						for (var d = 0; d < o; d++) {
							var c = r[d];
							delete s[c]
						} else
							for (c in s) r.push(c);
					o && !F.isEmptyObject(s) || delete t.pq_rowattr
				}!1 !== l && null != e && r.length && (i = r.join(" "), (u = this.getRow({
					rowIndxPage: a
				})) && u.removeAttr(i))
			} else {
				var u = t.pq_cellattr;
				if (u && u[n]) {
					var h = u[n];
					if (o)
						for (d = 0; d < o; d++) delete h[c = r[d]];
					else
						for (c in h) r.push(c);
					o && !F.isEmptyObject(h) || delete u[n]
				}!1 !== l && null != e && r.length && (i = r.join(" "), (t = this.getCell({
					rowIndxPage: a,
					dataIndx: n
				})) && t.removeAttr(i))
			}
	}, A.normalize = function(t, e) {
		var n, i, r = {};
		for (i in t) r[i] = t[i];
		var o = r.rowIndx,
			a = r.rowIndxPage,
			l = r.dataIndx,
			s = r.colIndx;
		return null == a && null == o || (n = this.riOffset, o = null == o ? +a + n : o, a = null == a ? +o - n : a, r.rowIndx = o, r.rowIndxPage = a, r.rowData = r.rowData || e && e[o] || this.getRowData(r)), null == s && null == l || (n = this.colModel, l = null == l ? n[s] ? n[s].dataIndx : void 0 : l, s = null == s ? this.colIndxs[l] : s, r.column = n[s], r.colIndx = s, r.dataIndx = l), r
	}, A.normalizeList = function(t) {
		var e = this,
			n = e.get_p_data();
		return t.map(function(t) {
			return e.normalize(t, n)
		})
	}, A.isSortable = function(t) {
		if (t) return null != t.dataIndx && this.options.sortModel.on && 0 != t.sortable
	}, A.addClassHead = function(t) {
		var e = this.getCellHeader(t),
			n = this._getHeadIndices(t.ri, t.colIndx),
			i = n.column || {},
			n = n.filterRow ? "clsFilter" : "clsHead",
			r = i[n],
			r = (r ? r + " " : "") + t.cls,
			r = pq.arrayUnique(r.split(/\s+/)).join(" ");
		i[n] = r, e.addClass(t.cls)
	}, A.removeClassHead = function(t) {
		var e, n, i, r, o;
		t.cls && (e = this.getCellHeader(t), o = (n = (i = this._getHeadIndices(t.ri, t.colIndx)).column || {})[i = i.filterRow ? "clsFilter" : "clsHead"] || "", r = t.cls.split(/\s+/), o = o.split(/\s+/).filter(function(t) {
			return t && -1 == r.indexOf(t)
		}), n[i] = o.join(" "), e.removeClass(t.cls))
	}, A.addClass = function(t) {
		var t = this.normalize(t),
			e = t.rowIndxPage,
			n = t.dataIndx,
			i = pq.arrayUnique,
			r = t.cls,
			o = t.refresh,
			t = t.rowData;
		if (t)
			if (!1 !== o && null == e && (e = this.getRowIndx({
					rowData: t
				}).rowIndxPage), null == n) {
				var a, l = t.pq_rowcls;
				a = i((a = l ? l + " " + r : r).split(/\s+/)).join(" "), t.pq_rowcls = a, !1 === o || null == e || !this.SelectRow().inViewRow(e) || (l = this.getRow({
					rowIndxPage: e
				})) && l.addClass(r)
			} else {
				var s = [];
				"function" != typeof n.push ? s.push(n) : s = n;
				for (var d = (d = t.pq_cellcls) || (t.pq_cellcls = {}), c = 0, u = s.length; c < u; c++) {
					var h = d[n = s[c]];
					a = i((a = h ? h + " " + r : r).split(/\s+/)).join(" "), d[n] = a, !1 === o || null == e || !this.SelectRow().inViewRow(e) || (h = this.getCell({
						rowIndxPage: e,
						dataIndx: n
					})) && h.addClass(r)
				}
			}
	}, A.removeClass = function(t) {
		var t = this.normalize(t),
			e = t.rowIndx,
			n = t.rowData,
			i = t.dataIndx,
			r = t.cls,
			o = t.refresh;

		function a(t, e) {
			if (t && e) {
				for (var n = t.split(/\s+/), i = e.split(/\s+/), r = [], o = 0, a = n.length; o < a; o++) {
					for (var l = n[o], s = !1, d = 0, c = i.length; d < c; d++)
						if (l === i[d]) {
							s = !0;
							break
						} s || r.push(l)
				}
				return 1 < r.length ? r.join(" ") : 1 === r.length ? r[0] : null
			}
		}
		if (n) {
			var l = n.pq_cellcls,
				t = n.pq_rowcls;
			if (!1 !== o && null == e && (e = this.getRowIndx({
					rowData: n
				}).rowIndx), null == i) t && (n.pq_rowcls = a(t, r), null != e && !1 !== o && (t = this.getRow({
				rowIndx: e
			})) && t.removeClass(r));
			else if (l) {
				var s = [];
				"function" != typeof i.push ? s.push(i) : s = i;
				for (var d = 0, c = s.length; d < c; d++) {
					var u = l[i = s[d]];
					u && (n.pq_cellcls[i] = a(u, r), null != e && !1 !== o && (u = this.getCell({
						rowIndx: e,
						dataIndx: i
					})) && u.removeClass(r))
				}
			}
		}
	}, A.hasClass = function(t) {
		var e, n = t.dataIndx,
			i = t.cls,
			t = this.getRowData(t),
			i = new RegExp("\\b" + i + "\\b");
		return t ? null == n ? !(!(e = t.pq_rowcls) || !i.test(e)) : !!((e = t.pq_cellcls) && e[n] && i.test(e[n])) : null
	}, A.getRowIndx = function(t) {
		var e, n = t.$tr,
			i = t.rowData,
			r = this.riOffset;
		if (i) {
			if (null != (a = i.pq_ri)) return {
				rowData: i,
				rowIndx: a,
				rowIndxPage: a - r
			};
			var o = this.get_p_data(),
				a = !1,
				l = t.dataUF ? this.options.dataModel.dataUF : null,
				s = !1;
			if (o)
				for (var d = 0, c = o.length; d < c; d++)
					if (o[d] == i) {
						s = !0;
						break
					} if (!s && l)
				for (a = !0, d = 0, c = l.length; d < c; d++)
					if (l[d] == i) {
						s = !0;
						break
					} return s ? (e = d - r, {
				rowIndxPage: a ? void 0 : e,
				uf: a,
				rowIndx: d,
				rowData: i
			}) : {}
		}
		return null == n || 0 == n.length || null == (e = this.iRenderB.getRowIndx(n[0])[0]) ? {} : {
			rowIndxPage: e,
			rowIndx: e + r
		}
	}, A.search = function(t) {
		for (var e = this.options, n = t.row, i = t.first, t = e.dataModel, e = e.pageModel.type, r = [], o = this.riOffset, a = "remote" == e, l = t.data, s = 0, d = l.length; s < d; s++) {
			var c, u = l[s],
				h = !0;
			for (c in n) n[c] !== u[c] && (h = !1);
			if (h) {
				var f = this.normalize({
					rowIndx: a ? s + o : s
				});
				if (r.push(f), i) break
			}
		}
		return r
	}, A._getFirstRC = function(t, e, n, i, r) {
		for (var e = this[e], o = 0, a = this.options[n], l = t ? this.iRenderB[i] : a, s = e.length; o < s; o++)
			if (!e[o = o == a && o < l ? l : o][r]) return o
	}, A.getFirstVisibleRIP = function(t) {
		return this._getFirstRC(t, "pdata", "freezeRows", "initV", "pq_hidden")
	}, A.getFirstVisibleCI = function(t) {
		return this._getFirstRC(t, "colModel", "freezeCols", "initH", "hidden")
	}, A.getLastVisibleRIP = function() {
		for (var t = this.pdata, e = t.length - 1; 0 <= e; e--)
			if (!t[e].pq_hidden) return e;
		return null
	}, A.getLastVisibleCI = function() {
		return this.iCols.getLastVisibleCI()
	}, A.getNextVisibleCI = function(t) {
		return this.iCols.getNextVisibleCI(t)
	}, A.getPrevVisibleCI = function(t) {
		return this.iCols.getPrevVisibleCI(t)
	}, A.getPrevVisibleRIP = function(t) {
		return this.iKeyNav.getPrevVisibleRIP(t)
	}, A.getNextVisibleRIP = function(t) {
		return this.iKeyNav.getNextVisibleRIP(t)
	}, A.KeyNav = function() {
		return this.iKeyNav
	}, A.calcWidthCols = function(t, e) {
		var n, i = 0,
			r = this.options.numberCell,
			o = this.colModel; - 1 == t && (r.show && (i += +r.width), t = 0);
		for (var a = t; a < e; a++)
			if ((n = o[a]) && !n.hidden) {
				if (!n._width) throw "assert failed";
				i += n._width
			} return i
	}
}(jQuery), ! function(L) {
	(L.paramquery.cKeyNav = function(e) {
		var n, i, r = this,
			t = e.$focusMgr;

		function o(t) {
			e["$focusMgr" + t].on("focusin", r["onFocus" + t].bind(r)).on("focusout", r["onBlur" + t].bind(r))
		}
		r.that = e, o("Head"), o(""), e.on("headerKeyDown", r.headKeyDown.bind(r)), t.on("keydown", function(t) {
			pq.isCtrl(t) && (r.ctrlKeyDown = !0)
		}).on("keyup", function(t) {
			r.ctrlKeyDown = !1
		}), e.options.editModel.pressToEdit && t.on("input", r.onInput.bind(r)), Object.defineProperties(r, {
			fe: {
				get: function() {
					return n
				},
				set: function(t) {
					n = t
				}
			},
			feHead: {
				get: function() {
					return i
				},
				set: function(t) {
					i = t
				}
			}
		})
	}).prototype = {
		onFocusHead: function(t) {
			this.onFocus(t, !0)
		},
		onFocus: function(t, e) {
			function n() {
				return i = null == i ? o.getFirstVisibleCI() : i
			}
			var i, r, o = this.that,
				t = t.target,
				a = !e,
				l = a ? "" : "Head",
				s = (0 == o.options.showHeader ? 0 : o.iRenderHead.data.length) ? 0 : null,
				d = o["$focusMgr" + l];
			2 == d.filter(":visible").length && (r = (t = d[0] == t.parentNode) ? a ? {
				rowIndxPage: o.getFirstVisibleRIP(),
				colIndx: n()
			} : {
				colIndx: n(),
				ri: s
			} : a ? {
				rowIndxPage: o.getLastVisibleRIP(),
				colIndx: n()
			} : {
				colIndx: n(),
				ri: s
			}, e && null == s || a && null == r.rowIndxPage || null == r.colIndx ? ((e = L(d[t ? 1 : 0])).hide(), pq.focusEle(!t), e.show()) : (this["focus" + l](r), a && this.cSelect(r.rowIndxPage, r.colIndx)))
		},
		cSelect: function(t, e) {
			var n = this.that,
				i = n.riOffset;
			"cell" == n.options.selectionModel.type && n.Range({
				r1: t + i,
				c1: e
			}).select()
		},
		onBlurHead: function(t) {
			this.onBlur(t, !0)
		},
		onBlur: function(t, e) {
			var n = this,
				i = t.target,
				e = !e ? "" : "Head",
				r = "fe" + e,
				o = n[r],
				a = n["_ignoreBlur" + e],
				l = n.that;
			document.activeElement == i || a || L(t.currentTarget).is(".pq-editor-outer") || (o && (n.removeClass(o, e), n[r] = null), l["$focusMgr" + e].show(), l._trigger("blur" + e, t, o))
		},
		focusHead: function(t) {
			this.focus(t, !0)
		},
		resetFocusMgr: function(t, e, n, i) {
			var r = {
					textbox: "input",
					textarea: "textarea",
					contenteditable: "div[contenteditable]"
				} [(e = e || {}).type] || "textarea",
				e = e.attr || "";
			return t.html({
				input: "<input " + e + (e.includes("type") ? "" : " type='text'") + "/>",
				textarea: "<textarea " + e + "></textarea>",
				"div[contenteditable]": "<div contenteditable='true' tabindex='0' " + e + "></div>"
			} [r]), e = t.children(), (!n || "ontouchstart" in window) && e.attr(e.is("div") ? {
				contenteditable: !1
			} : {
				readonly: !0
			}), t[0].className = "pq-focus-mgr" + (i ? " pq-focus-mgr-head" : ""), e
		},
		ignoreBlur: function(t, e) {
			this["_ignoreBlur" + (e = e || "")] = !0, t(), this["_ignoreBlur" + e] = !1
		},
		focus: function(t, e) {
			t = t || {};
			var n, i, r, o, a, l, s, d, c = this,
				u = c.that,
				h = !e,
				f = h ? "" : "Head",
				p = u["$focusMgr" + f],
				g = "fe" + f,
				m = u.iMerge,
				v = 1,
				w = 0,
				x = t.evt,
				y = t.body,
				C = h ? u.pdata : u.iRenderHead.data,
				b = u.$cont,
				I = t.noscroll,
				q = c[g];
			if (u.$div_focus) {
				if (!u.saveEditCell()) return;
				u.quitEditMode()
			}

			function _() {
				L(p[v]).hide(), r = p[w], (p = L(r)).show()
			}

			function R() {
				n = u[h ? "getCell" : "getCellHeader"](t), i = n[0], c.removeClass(q, f), t.cls = "pq-focus" + (u.options.noBorderFocus ? " pq-no-border" : ""), u["addClass" + f](t), c.ignoreBlur(function() {
					_(), i && (s = i.getBoundingClientRect(), l = p.parent()[0].getBoundingClientRect(), p.css({
						left: s.left - l.left,
						top: s.top - l.top
					}), I || c.scrollIntoView(r, s)), c.resetFocusMgr(p, h ? u.getEditor(t, ["type", "attr"]) : {}, h ? u.isEditable(t) : "", e).focus()
				}, f), (q = c[g] = t).cell = i, u._trigger("focus" + f, null, q)
			}
			y || (h ? null != (o = null == (o = t.rowIndxPage) ? t.rowIndxPage = u.getFirstVisibleRIP(!0) : o) && (d = o + u.riOffset) : e && null == (d = t.ri) && (d = t.ri = C.length - 1), null != (a = t.colIndx) && -1 != a || (a = t.colIndx = u.getFirstVisibleCI(!0))), 0 <= d && 0 <= a ? (h && (c.isLastFocusableCell(t) && (v = 0, w = 1), m.ismergedCell(d, a) && (C = m.getRootCellO(d, a), o = t.rowIndxPage = C.rowIndxPage, a = t.colIndx = C.colIndx)), I ? R() : h ? u.scrollCell({
				rowIndxPage: o,
				colIndx: a
			}, R) : u.scrollColumn({
				colIndx: a
			}, R)) : y && (_(), c.removeClass(q, f), m = x.pageX, d = x.pageY, null != m && null != d && (C = b.offset(), p.css({
				left: Math.max(0, m - C.left - 20),
				top: Math.max(0, d - C.top - 20)
			})), c.ignoreBlur(function() {
				c.resetFocusMgr(p).focus()
			}), b.addClass("pq-focus"), q = c[g] = t, u._trigger("focus" + f, null, q))
		},
		removeClass: function(t, e) {
			var n = this.that;
			t && (t.body ? n.$cont.removeClass("pq-focus") : n["removeClass" + e](t))
		},
		scrollIntoView: function(t, e) {
			var n, i = {
				behavior: "smooth"
			};
			e.top < 0 || e.bottom > window.innerHeight ? (n = 1, i.block = "center") : (e.left < 0 || e.right > window.innerWidth) && (n = 1, i.block = "nearest", i.inline = "center"), n && t.scrollIntoView(i)
		},
		isLastFocusableCell: function(t) {
			var e = this.that;
			return e.getLastVisibleRIP() == t.rowIndxPage && e.getLastVisibleCI() == t.colIndx
		},
		getFocusHead: function() {
			return this.feHead
		},
		getFocus: function() {
			return this.fe
		},
		headKeyDown: function(t, e) {
			var n = this,
				i = t.keyCode,
				r = n.that,
				o = r.iRenderHead.data,
				a = o.length,
				l = n.feHead;
			if (l) {
				var s, d, c, u, h = null == l.ri ? a - 1 : l.ri,
					f = l.colIndx,
					p = o[h] ? o[h][f] : null,
					g = L.ui.keyCode,
					m = i == g.UP,
					v = i == g.DOWN,
					w = i == g.LEFT,
					x = i == g.RIGHT,
					y = r.options.rtl,
					C = w && !y || x && y,
					w = w && y || x && !y,
					b = i == g.TAB,
					x = t.shiftKey,
					y = r.getCellHeader({
						ri: h,
						colIndx: f
					});
				if (0 != r._trigger("beforeHeadKeyDown", t, l)) {
					if (i == g.ENTER) pq.isCtrl(t) ? (c = y.find(".pq-icon-menu,.pq-icon-filter")).length && c.click() : (c = y.find(".pq-icon-detail")).length ? c.click() : r.isSortable(p) ? ((l = L.Event("click")).shiftKey = t.shiftKey, y.find(".pq-title-span").trigger(l)) : p && (c = p.collapsible) ? (c.on = !c.on, r.refreshCM(), r.refresh(), I()) : (l = y.find("input,select,textarea")).length && l[0].focus();
					else if (i == g.SPACE) y.find("input").click(), d = !0;
					else if (b && x || C) {
						for (;;)
							if (f = r.getPrevVisibleCI(f - 1), s = o[h][f], null == f) {
								if (!(0 < h && b)) break;
								f = o[--h].length
							} else if (!s || s != p) {
							I(), d = !0;
							break
						}
					} else if (b || w) {
						for (;;)
							if (f = r.getNextVisibleCI(f + 1), s = o[h] ? o[h][f] : null, null == f) {
								if (!(b && h < a - 1)) break;
								h++, f = -1
							} else if (!s || s != p) {
							I(), d = !0;
							break
						}
					} else if (v || m)
						for (;;) {
							if (v ? h++ : h--, !o[h]) {
								v && null != (u = r.getFirstVisibleRIP()) && (r.focus({
									rowIndxPage: u,
									colIndx: f
								}), n.cSelect(u, f));
								break
							}
							if ((s = o[h][f]) != p) {
								I();
								break
							}
						}
					d && t.preventDefault()
				}
			}

			function I() {
				n.focusHead({
					ri: h,
					colIndx: f
				})
			}
		},
		onInput: function(t) {
			var e, n, i = this.that,
				r = this.fe;
			!this.ctrlKeyDown && r && null != r.rowIndxPage && null != r.colIndx && (n = "select" == (e = i.getEditor(r, ["type"]).type), i.isEditable(r) && e && !n && i.editCell(L.extend({
				editByPress: !0
			}, r)))
		},
		bodyKeyDown: function(e) {
			function t(t) {
				return I == t
			}

			function n() {
				return s.getFirstVisibleCI()
			}

			function i() {
				return s.getLastVisibleCI()
			}

			function r() {
				return s.getFirstVisibleRIP()
			}

			function o() {
				return s.getLastVisibleRIP()
			}

			function a() {
				s.Selection().removeAll()
			}
			var l = this,
				s = l.that,
				d = s.riOffset,
				c = s.options,
				u = c.rtl,
				h = s.iMerge,
				f = L(e.target),
				p = l.fe,
				g = s.colModel,
				m = c.selectionModel,
				$ = c.editModel,
				v = s.$cont[0],
				v = f[0] == v,
				w = pq.isCtrl(e),
				x = L.ui.keyCode,
				y = x.LEFT,
				C = x.RIGHT,
				b = x.TAB,
				I = e.keyCode,
				y = I == y,
				C = I == C,
				q = t(x.HOME),
				_ = t(x.END),
				b = I == b,
				R = t(x.SPACE),
				D = t(x.PAGE_UP),
				H = t(x.PAGE_DOWN),
				M = e.shiftKey,
				T = t(x.ENTER),
				O = b && M,
				M = b && !M,
				V = t(x.UP),
				N = t(x.DOWN);
			if ($.indices) s.$div_focus.find(".pq-cell-focus").focus();
			else {
				if (v && !p && M) return F = s.getViewPortIndx(), void s.focus({
					rowIndxPage: F.initV,
					colIndx: F.initH
				});
				if (!f.hasClass("pq-cell-editor")) {
					if (R && v) return !1;
					if (!f.is("select,input") || f.parent().is(".pq-focus-mgr")) {
						var S, k, E, F = s.normalize(p),
							R = F.rowIndxPage,
							P = F.rowIndx,
							A = F.colIndx,
							v = s.pdata,
							f = F.rowData,
							p = F;
						if (null != P && null != A && null != f) {
							if (h.ismergedCell(P, A) && (R = (F = p = h.getRootCellO(P, A)).rowIndxPage, P = F.rowIndx, A = F.colIndx, (D || H || q || _) && (F = h.getData(P, A, "proxy_cell")) && !v[h = F.rowIndx - d].pq_hidden && (P = (R = h) + d), g[A].hidden && (A = s.getNextVisibleCI(A))), 0 == s._trigger("beforeCellKeyDown", e, p)) return !1;
							s._trigger("cellKeyDown", e, p), T && s._trigger("cellClickE", e, p), q || w && y ? (w && q && (P = r() + d), A = (u ? i : n)(), l.select(P, A, e), S = !0) : _ || w && C ? (w && _ && (P = o() + d), A = (u ? n : i)(), l.select(P, A, e), S = !0) : y || C || V || N || m.onTab && b ? ((y && !u || C && u) && A != n() || O ? k = l.incrIndx(R, A, !1) : (C && !u || y && u) && (A != i() || c.autoAddCol) || M ? (!b && c.autoAddCol && A == i() && s.Columns().add([{}]), M && A == i() && (f.pq_detail || {}).show ? pq.focusEle(null, f.pq_detail.child) && (a(), S = !0) : !(k = l.incrIndx(R, A, !0)) && b && (v = s.parent(), F = pq.getFocusEle(), v && v.widget()[0].contains(F) && (h = v.Detail().getRip(s.widget().closest(".pq-detail")[0]), (k = v.KeyNav().incrIndx(h, v.getLastVisibleCI(), !0)) && (v.focus(k), v.KeyNav().cSelect(k.rowIndxPage, k.colIndx), S = !(k = null))))) : V ? (k = w ? {
								rowIndxPage: r(),
								colIndx: A
							} : l.incrRowIndx(R, A, !1)).rowIndxPage == R && (l.focusHead({
								colIndx: A
							}), a(), k = null) : N && (k = w ? {
								rowIndxPage: o(),
								colIndx: A
							} : (c.autoAddRow && R == o() && s.addNodes([{}]), l.incrRowIndx(R, A, !0))), k ? (P = k.rowIndxPage + d, l.select(P, k.colIndx, e)) : null == S && b && (a(), S = !1), null == S && (S = !0)) : H || D ? (s.iRenderB[D ? "pageUp" : "pageDown"](R, function(t) {
								P = t + d, l.select(P, A, e)
							}), S = !0) : I == x.ENTER ? ((E = s.getCell(p)) && E[0] && (s.isEditable(p) ? s.editCell(p) : (g = E.find("button,input[type='radio']"))[0] && L(g[0]).click()), S = !0) : w && "65" == I ? (T = s.iSelection, "row" == m.type && "single" != m.mode ? s.iRows.toggleAll({
								all: m.all
							}) : "cell" == m.type && "single" != m.mode && T.selectAll({
								type: "cell",
								all: m.all
							}), S = !0) : w ? S = !1 : $.pressToEdit && this.isEditKey(I) && !w && (46 == I ? s.clear() : ("select" == s.getEditor(p, ["type"]).type && (R = p.rowIndxPage, A = p.colIndx, (E = s.getCell(p)) && E[0] && s.isEditable(p) && s.editCell({
								rowIndxPage: R,
								colIndx: A,
								select: !0
							})), S = !1), null == S && (S = !0)), S && e.preventDefault()
						}
					}
				}
			}
		},
		getPrevVisibleRIP: function(t) {
			for (var e = this.that.pdata, n = t - 1; 0 <= n; n--)
				if (e[n] && !e[n].pq_hidden) return n;
			return t
		},
		setDataMergeCell: function(t, e) {
			var n, i = this.that.iMerge;
			i.ismergedCell(t, e) && (n = i.getRootCellO(t, e), i.setData(n.rowIndx, n.colIndx, {
				proxy_cell: {
					rowIndx: t,
					colIndx: e
				}
			}))
		},
		getValText: function(t) {
			var t = t[0].nodeName.toLowerCase(),
				e = "text";
			return e = -1 != L.inArray(t, ["input", "textarea", "select"]) ? "val" : e
		},
		getNextVisibleRIP: function(t) {
			for (var e = this.that.pdata, n = t + 1, i = e.length; n < i; n++)
				if (e[n] && !e[n].pq_hidden) return n;
			return t
		},
		incrEditIndx: function(t, e, n) {
			var i = this.that,
				r = i.colModel,
				o = r.length,
				a = i.iMerge,
				l = i.riOffset,
				s = i[n ? "getLastVisibleRIP" : "getFirstVisibleRIP"]();
			do {
				var d, c = t + l;
				if (e = a.ismergedCell(c, e) ? (d = a.getRootCell(c, e), (u = a.getData(c, e, "proxy_edit_cell")) && (t = (c = u.rowIndx) - l), n ? e + d.o_cc : e - 1) : n ? e + 1 : e - 1, n && o <= e || !n && e < 0) {
					if (t == s) return null;
					t = this[n ? "getNextVisibleRIP" : "getPrevVisibleRIP"](t), e = n ? 0 : o - 1
				}
				a.ismergedCell(c = t + l, e) && (d = a.getRootCellO(c, e), a.setData(d.rowIndx, d.colIndx, {
					proxy_edit_cell: {
						rowIndx: c,
						colIndx: e
					}
				}), c = d.rowIndx, e = d.colIndx);
				var u = r[e],
					h = i.isEditable({
						rowIndx: c,
						colIndx: e
					}),
					f = "function" == typeof(f = u.editor) ? f.call(i, i.normalize({
						rowIndx: c,
						colIndx: e
					})) : f
			} while (t = c - l, u && (u.hidden || 0 == h || !1 === f));
			return {
				rowIndxPage: t,
				colIndx: e
			}
		},
		incrIndx: function(t, e, n) {
			var i, r, o, a, l, s = this.that,
				d = s.iMerge,
				c = t,
				u = e,
				h = s.pdata,
				f = s.riOffset,
				p = "get" + (n ? "Last" : "First") + "Visible",
				g = s[p + "RIP"](),
				p = s[p + "CI"](),
				m = s.colModel,
				v = m.length;
			if (null == u) c != g && (l = {
				rowIndxPage: c = this[n ? "getNextVisibleRIP" : "getPrevVisibleRIP"](c)
			});
			else if (u == p)(l = this.incrRowIndx(c, u, n)).rowIndxPage != c && (l.colIndx = s["get" + (n ? "First" : "Last") + "VisibleCI"]());
			else {
				for (; d.ismergedCell(r = c + f, u) && (i = d.getRootCell(r, u), h[c = a || !(o = d.getData(i.o_ri, i.o_ci, "proxy_cell")) || h[o = o.rowIndx - f].pq_hidden ? c : o].pq_hidden && (c = d.getRootCellV(r, u).rowIndxPage), !a && n && (u = i.o_ci + (i.o_cc ? i.o_cc - 1 : 0))), n ? u < v - 1 && u++ : 0 < u && u--, (a = m[u]) && (a.hidden || a.noFocus););
				l = {
					rowIndxPage: c,
					colIndx: u
				}
			}
			if (l.rowIndxPage != t || l.colIndx != e) return l
		},
		incrRowIndx: function(t, e, n) {
			var i = this.that,
				r = i.riOffset,
				o = t + r,
				i = i.iMerge;
			return i.ismergedCell(o, e) && (o = i.getRootCell(o, e), i = i.getData(o.o_ri, o.o_ci, "proxy_cell"), n && (t = o.o_ri - r + o.o_rc - 1), e = i ? i.colIndx : o.v_ci), {
				rowIndxPage: t = this["get" + (n ? "Next" : "Prev") + "VisibleRIP"](t),
				colIndx: e
			}
		},
		isEditKey: function(t) {
			return 32 <= t && t <= 127 || 189 == t || 190 == t || 187 == t
		},
		keyDownInEdit: function(t) {
			var e, n, i, r, o, a, l = this.that,
				s = l.options,
				d = s.editModel.indices;
			if (d) return n = L(t.target), e = L.ui.keyCode, a = s.editModel, d = L.extend({}, d), i = d.rowIndxPage, r = d.colIndx, o = d.column.editModel, o = o ? L.extend({}, a, o) : a, a = this.getValText(n), n.data("oldVal", n[a]()), 0 != l._trigger("editorKeyDown", t, d) && ((n = t.keyCode) == e.TAB || n == o.saveKey && !t.altKey ? (d = "downFocus" == (a = n == e.TAB ? o.onTab : o.onSave) ? (s.autoAddRow && i == l.getLastVisibleRIP() && l.addNodes([{}]), this.incrRowIndx(i, r, !t.shiftKey)) : {
				rowIndxPage: i,
				colIndx: r,
				incr: !!a,
				edit: "nextEdit" == a
			}, this.saveAndMove(d, t)) : n == e.ESCAPE ? (l.quitEditMode({
				evt: t
			}), l.focus({
				rowIndxPage: i,
				colIndx: r
			}), t.preventDefault(), !1) : n == e.PAGE_UP || n == e.PAGE_DOWN ? (t.preventDefault(), !1) : !o.keyUpDown || t.altKey || n != e.DOWN && n != e.UP ? void 0 : (d = this.incrRowIndx(i, r, n == e.DOWN), this.saveAndMove(d, t)))
		},
		keyPressInEdit: function(t, e) {
			var n = this.that,
				i = n.options.editModel,
				r = i.indices,
				e = (e || {}).FK,
				o = r.column,
				a = L.ui.keyCode,
				l = ["BACKSPACE", "LEFT", "RIGHT", "UP", "DOWN", "DELETE", "HOME", "END"].map(function(t) {
					return a[t]
				}),
				o = o.dataType;
			if (0 <= L.inArray(t.keyCode, l)) return !0;
			if (!1 === n._trigger("editorKeyPress", t, L.extend({}, r))) return !1;
			if (e && ("float" == o || "integer" == o)) {
				l = r.$editor.val(), n = i.charsAllow["float" == o ? 0 : 1], e = t.charCode || t.keyCode, r = String.fromCharCode(e);
				if ("=" !== l[0] && r && -1 == n.indexOf(r)) return !1
			}
			return !0
		},
		keyUpInEdit: function(t, e) {
			var n = this.that,
				i = n.options,
				e = (e || {}).FK,
				i = i.editModel,
				r = i.indices;
			n._trigger("editorKeyUp", t, L.extend({}, r));
			var o, n = r.column.dataType;
			!e || "float" != n && "integer" != n || (r = L(t.target), e = "integer" == n ? i.reInt : i.reFloat, t = this.getValText(r), i = r.data("oldVal"), o = r[t](), 0 == e.test(o) && "=" !== o[0] && (e.test(i) ? r[t](i) : (o = ("float" == n ? parseFloat : parseInt)(i), isNaN(o) ? r[t](0) : r[t](o))))
		},
		saveAndMove: function(t, e) {
			if (null == t) return e.preventDefault(), !1;
			var n, i, r = this,
				o = r.that,
				a = t.rowIndxPage,
				l = t.colIndx;
			return !(o._blurEditMode = !0) !== o.saveEditCell({
				evt: e
			}) && o.pdata ? (o.quitEditMode(e), t.incr && (i = r[t.edit ? "incrEditIndx" : "incrIndx"](a, l, !e.shiftKey), a = i ? i.rowIndxPage : a, l = i ? i.colIndx : l), o.scrollCell({
				rowIndxPage: a,
				colIndx: l
			}, function() {
				n = a + o.riOffset, r.select(n, l, e), t.edit && o._editCell({
					rowIndxPage: a,
					colIndx: l
				})
			}), o._deleteBlurEditMode({
				timer: !0,
				msg: "saveAndMove"
			})) : (o.pdata || o.quitEditMode(e), o._deleteBlurEditMode({
				timer: !0,
				msg: "saveAndMove saveEditCell"
			})), e.preventDefault(), !1
		},
		select: function(o, a, l) {
			var s = this.that,
				d = o - s.riOffset,
				t = (this.setDataMergeCell(o, a), s.options),
				c = s.iSelection,
				u = t.selectionModel,
				t = u.type,
				h = "row" == t,
				f = "cell" == t;
			s.scrollCell({
				rowIndx: o,
				colIndx: a
			}, function() {
				var t, e, n, i, r = c.address();
				l.shiftKey && l.keyCode !== L.ui.keyCode.TAB && u.type && "single" != u.mode && (r.length || h) ? h ? s.iRows.extend({
					rowIndx: o,
					evt: l
				}) : (e = (t = r[r.length - 1]).firstR, n = t.firstC, "column" == (i = t.type) ? (t.c1 = n, t.c2 = a, t.r1 = t.r2 = t.type = t.cc = t.rc = void 0, s.Range(r, !1).select()) : "row" == i ? c.resizeOrReplace({
					r1: e,
					r2: o,
					firstR: e,
					firstC: n
				}) : c.resizeOrReplace({
					r1: e,
					c1: n,
					r2: o,
					c2: a,
					firstR: e,
					firstC: n
				})) : h || f && s.Range({
					r1: o,
					c1: a,
					firstR: o,
					firstC: a
				}).select(), s.focus({
					rowIndxPage: d,
					colIndx: a
				})
			})
		}
	}
}(jQuery), ! function(t) {
	var n, i;
	(t.paramquery.cGenerateView = function() {}).prototype = {
		autoFitCols: function() {
			var t = this.that,
				e = t.colModel,
				n = e.length,
				i = this.dims,
				t = t.calcWidthCols(-1, n, !0),
				r = this.getSBWd(),
				i = i.wdCenter - r;
			if (t !== i) {
				for (var o, a = t - i, l = [], s = 0; s < n; s++) {
					var d = (h = e[s])._percent,
						c = (h.resizable, h._resized);
					h.hidden || d || c || (a < 0 ? (g = h._maxWidth - h._width) && l.push({
						availWd: -1 * g,
						colIndx: s
					}) : (g = h._width - h._minWidth) && l.push({
						availWd: g,
						colIndx: s
					})), c && delete(o = h)._resized
				}
				l.sort(function(t, e) {
					return t.availWd > e.availWd ? 1 : t.availWd < e.availWd ? -1 : 0
				});
				for (var s = 0, u = l.length; s < u; s++) {
					var h, f, p = l[s],
						g = p.availWd,
						p = p.colIndx,
						m = Math.round(a / (u - s)),
						p = (h = e[p])._width;
					Math.abs(g) > Math.abs(m) ? (f = p - m, a -= m) : (f = p - g, a -= g), h.width = h._width = f
				}
				0 != a && o && ((f = o._width - a) > o._maxWidth ? f = o._maxWidth : f < o._minWidth && (f = o._minWidth), o.width = o._width = f)
			}
		},
		numericVal: function(t, e) {
			e = -1 < (t + "").indexOf("%") ? parseInt(t) * e / 100 : parseInt(t);
			return Math.round(e)
		},
		refreshColumnWidths: function(t) {
			t = t || {};
			var e = this.that,
				n = e.options,
				i = n.numberCell,
				r = "flex" === n.width,
				o = e.colModel,
				a = this.autoFit,
				l = this.dims.wdCenter,
				s = o.length,
				d = n.minColWidth,
				c = n.maxColWidth,
				u = 0,
				h = (i.show && (i.width < i.minWidth && (i.width = i.minWidth), u = i.outerWidth = i.width), r ? null : +l - u),
				d = Math.floor(this.numericVal(d, h)),
				c = Math.ceil(this.numericVal(c, h)),
				f = 0;
			if (!r && h < 5 || isNaN(h)) {
				if (n.debug) throw "availWidth N/A"
			} else {
				delete e.percentColumn;
				for (var p = 0; p < s; p++) {
					var g, m, v, w, x, y, C = o[p];
					C.hidden || (m = -1 < ((g = C.width) + "").indexOf("%") || null, v = C.minWidth, w = C.maxWidth, v = v ? this.numericVal(v, h) : d, (w = w ? this.numericVal(w, h) : c) < v && (w = v), null != g ? (y = 0, !r && m ? (e.percentColumn = !0, C.resizable = !1, C._percent = !0, 1 <= (f += (x = +this.numericVal(g, h)) - (y = Math.floor(x))) && (y += 1, --f)) : g && (y = +g), y < v ? y = v : w < y && (y = w), C._width = y) : C._width = v, m || (C.width = C._width), C._minWidth = v, C._maxWidth = r ? 1e3 : w)
				}!1 == r && !1 !== t.refreshWidth && a && this.autoFitCols()
			}
		},
		format: (n = t.datepicker, i = pq.formatNumber, function(t, e) {
			return pq.isFn(e) ? e(t) : pq.isDateFormat(e) ? t == parseInt(t) ? pq.formulas.TEXT(t, pq.juiToExcel(e)) : isNaN(Date.parse(t)) ? void 0 : n.formatDate(e, new Date(t)) : t == parseFloat(t) ? i(t, e) : void 0
		}),
		renderCell: function(t) {
			var e, n, i, r, o, a, l, s = this.that,
				d = pq.styleStr,
				c = pq.styleObj,
				u = t.attr || [],
				h = c((h = t.style || [])[0]),
				f = t.Export,
				p = s.options,
				g = t.cls || [],
				m = t.rowData,
				v = t.rowIndxPage,
				w = t.column,
				x = w.dataIndx,
				y = (m.pq_celldt || {})[x] || w.dataType,
				C = "pic" == y,
				b = t.colIndx,
				I = s.processAttr,
				q = w.style,
				_ = m.pq_fn || {},
				R = this.rowStyle,
				D = (m.pq_cellprop || {})[x] || {},
				M = m.pq_rowprop || {},
				T = p.freezeCols,
				S = p.columnBorders;
			if (m) return a = m[x], f || (q && c(q, h), R[v] && c(R[v], h), (q = (m.pq_cellstyle || {})[x]) && c(q, h), b == T - 1 && S && g.push("pq-last-frozen-col"), w.cls && g.push(w.cls), p.editModel.addDisableCls && !1 === s.isEditable(t) && g.push("pq-cell-disable"), C ? a = !a || "data" != a.substr(0, 4) && "http" != a.substr(0, 4) ? a : '<img style="max-height:100%;max-width:100%;" src = "' + a + '" />' : pq.isStr(a) && "html" != y && (a = pq.escapeHtml(a))), R = p.format.call(s, m, w, D, M), v = R ? this.format(a, R, y) : a, _ = (_[x] || {}).fn, t.dataIndx = x, t.cellData = a, t.formatVal = v, (q = w.render) ? (l = s.callFn(q, t)) && "string" != typeof l && ((n = l.attr) && u.push(I(n)), o = l.prop, (r = l.cls) && g.push(r), (i = l.style) && c(i, h), l = l.text) : D.link ? l = "<a href='" + (e = D.link) + "' target='_blank'>" + (a || e) + "</a>" : _ && 0 == _.indexOf("HYPERLINK") && (l = "<a href='" + (e = _.substring(11, _.indexOf('"', 11))) + "' target='_blank'>" + (a || e) + "</a>"), (l = null == l && (q = w._renderG || w._render) ? q.call(s, t) : l) && "string" != typeof l && ((n = l.attr) && u.push(n), (r = l.cls) && g.push(r), (i = l.style) && c(i, h), l = l.text), null == l && (l = v || a), f ? [l, i, o, (n || {}).title] : (b = D.align, (b = (o = o || {}).align || (null != b ? b : M.align || w.align)) && g.push("pq-align-" + b), b = D.valign, (b = o.valign || (null != b ? b : M.valign || w.valign)) && g.push("pq-valign-" + b), (T = (m.pq_cellcls || {})[x]) && g.push(T), (S = (m.pq_cellattr || {})[x]) && u.push(I(S, h)), h = (h = d(h)) ? " style='" + h + "' " : "", null == (l = pq.newLine(l)) ? l = "" : pq.isLink(l) && g.push("pq-has-link"), ["<div class='", g.join(" "), "' ", u.join(" "), h, " >", C ? l : "<div>" + l + "</div>", "</div>"].join(""))
		}
	}
}(jQuery), ! function(u) {
	var n, t = u.paramquery,
		e = t._pqGrid.prototype;
	e.getHeadCell = function(t) {
		var e, n, i, t = this.iRenderHead.getCellIndx(t[0]),
			r = t[0],
			t = t[1];
		return (i = null != t && null != r && (n = (this.headerCells[r] || [])[t]) ? n.colModel : i) && i.length && (e = !0), {
			col: n || this.colModel[t],
			ci: t,
			ri: r,
			isParent: e
		}
	}, e.flex = function(t) {
		var e = this.colIndxs;
		t && t.dataIndx && (t.colIndx = t.dataIndx.map(function(t) {
			return e[t]
		})), this.iResizeColumns.flex(t)
	}, e.flexAsync = function(t) {
		var e = this;
		cancelAnimationFrame(n), n = requestAnimationFrame(function() {
			e.flex(t)
		})
	}, t.mixHeader = {
		colCollapse: function(t, e) {
			var n = this.that,
				i = {
					column: t
				},
				t = t.collapsible;
			!1 !== n._trigger("beforeColumnCollapse", e, i) && (t.on = !t.on, !1 !== n._trigger("columnCollapse", e, i) && n.refresh({
				colModel: !0
			}))
		},
		onHeaderClick: function(t) {
			var e, n = this.that,
				i = n.iDragColumns;
			if (n._trigger("headerClick", t), !i || "stop" == i.status) {
				if ((i = u(t.target)).is("input,label")) return !0;
				if ((e = i.closest(".pq-grid-col,.pq-grid-number-cell")).length)
					if (e = (n = n.getHeadCell(e)).col, i.hasClass("pq-col-collapse")) this.colCollapse(e, t);
					else if (!n.isParent) return this.onHeaderCellClick(e, n.ci, t)
			}
		},
		getTitle: function(t, e) {
			var n = t.title;
			return pq.isFn(n) ? n.call(this.that, {
				column: t,
				colIndx: e,
				dataIndx: t.dataIndx
			}) : n
		},
		createHeaderCell: function(t) {
			var e, n = this.that,
				i = n.options,
				r = t.cls,
				o = t.style,
				a = t.attr,
				l = t.column,
				s = t.colIndx,
				d = this.getSortSpaceSpans(i.sortModel),
				c = l.collapsible,
				u = pq.styleStr,
				h = l.halign || l.align,
				f = l.hvalign,
				p = l.cls,
				g = (l.type, l.colModel),
				i = this.hasMenuH(i, l),
				s = null != (s = this.getTitle(l, s)) ? s : l.dataIndx;
			return h && r.push("pq-align-" + h), f && r.push("pq-valign-" + f), (h = l.styleHead) && o.push(u(h)), (h = l.attrHead) && a.push(n.processAttr(h)), p && r.push(p), r.push(l.clsHead), i && r.push("pq-has-menu"), g && g.length ? c && (r.push("pq-collapsible-th"), e = ["<span class='pq-col-collapse pq-icon-hover ui-icon ui-icon-", c.on ? "plus" : "minus", "'></span>"].join("")) : l.empty || r.push("pq-grid-col-leaf"), a.push("pq-row-indx=" + t.rowIndx + " pq-col-indx=" + t.colIndx), l.pq_title = s, ["<div ", a.join(" "), " ", " class='", r.join(" "), "' style='", o.join(""), "' >", "<div class='pq-td-div'>", e, "<span class='pq-title-span'>", s, "</span>", d, "</div>", i ? "<span class='pq-icon-menu'></span>" : "", "</div>"].join("")
		},
		getSortSpaceSpans: function(t) {
			var e;
			return t.on ? ["<span class='pq-icon-col-sort", e = t.space ? " pq-space" : "", "'></span>", t.number ? "<span class='pq-col-sort-count" + e + "'></span>" : ""].join("") : ""
		},
		hasMenuH: function(t, e) {
			var n = e.colModel;
			if (e.empty || n && n.length) return !1;
			n = t.menuIcon, t = e.menuIcon;
			return n && !1 !== t || !1 !== n && t
		},
		onHeaderCellClick: function(t, e, n) {
			t = t || {};
			var i, r, o, a = this.that,
				l = a.options,
				s = l.sortModel,
				l = l.selectionModel,
				d = u(n.target),
				c = t.dataIndx;
			!1 !== a._trigger("headerCellClick", n, {
				column: t,
				colIndx: e,
				dataIndx: c
			}) && -1 != e && d.closest(".pq-grid-row").hasClass("pq-grid-title-row") && (l.column && l.type && !d.hasClass("pq-title-span") && !d.hasClass("ui-icon") ? (l = {
				c1: e,
				firstC: e,
				firstR: a.getFirstVisibleRIP()
			}, r = (i = (o = a.iSelection).address()).length, pq.isCtrl(n) ? o.add(l) : (n.shiftKey && (r && "column" == i[r - 1].type && ((o = i[r - 1]).c1 = o.firstC, o.c2 = e, o.r1 = o.r2 = o.type = o.cc = void 0), l = i), a.Range(l, !1).select()), null != (r = a.getFirstVisibleRIP(!0)) && (a.focus({
				rowIndxPage: r,
				colIndx: e
			}), a._trigger("mousePQUp"))) : (s.wholeCell || d.hasClass("pq-title-span")) && a.isSortable(t) && a.sort({
				sorter: [{
					dataIndx: c,
					sortIndx: t.sortIndx
				}],
				addon: !0,
				skipCustomSort: pq.isCtrl(n),
				tempMultiple: s.multiKey && n[s.multiKey],
				evt: n
			}))
		},
		setSortIcons: function() {
			var t = this.that,
				e = t.options.ui,
				n = t.headerCells.length - 1;
			if (t.$head_i) {
				var i = t.iSort.getSorter(),
					r = i.length,
					o = !1;
				t.options.sortModel.number && 1 < r && (o = !0);
				for (var a = 0; a < r; a++) {
					var l, s = i[a],
						d = s.dataIndx,
						d = t.getColIndx({
							dataIndx: d
						}),
						s = s.dir;
					0 <= d && (l = e.header_active + " pq-col-sort-" + ("up" == s ? "asc" : "desc"), s = "ui-icon ui-icon-triangle-1-" + ("up" == s ? "n" : "s"), (d = u(t.iRenderHead.getCell(n, d))).addClass(l), d.find(".pq-icon-col-sort").addClass(s), o && d.find(".pq-col-sort-count").html(a + 1))
				}
			}
		}
	}, t.cResizeColumns = function(t) {
		var n = this,
			e = ((n.that = t).$head_i.on({
				mousedown: function(t) {
					var e;
					t.pq_composed || (e = u(t.target), n.setDraggables(t), t.pq_composed = !0, t = u.Event("mousedown", t), e.trigger(t))
				},
				dblclick: function(t) {
					n.doubleClick(t)
				}
			}, ".pq-grid-col-resize-handle"), t.options),
			i = e.flex;
		n.rtl = e.rtl ? "right" : "left", i.on && i.one && t.one("ready", function() {
			n.flex()
		})
	}, t.cResizeColumns.prototype = {
		doubleClick: function(t) {
			var e = this.that.options,
				n = e.flex,
				t = u(t.target),
				t = parseInt(t.attr("pq-col-indx"));
			isNaN(t) || n.on && this.flex(n.all && !e.scrollModel.autoFit ? {} : {
				colIndx: [t]
			})
		},
		flex: function(t) {
			this.that.iRenderB.flex(t)
		},
		setDraggables: function(t) {
			var n, i, t = u(t.target),
				r = this,
				o = r.rtl;
			t.draggable({
				axis: "x",
				helper: function(t, e) {
					var n = u(t.target),
						i = parseInt(n.attr("pq-col-indx"));
					return r._setDragLimits(i), r._getDragHelper(t, e), n
				},
				start: function(t, e) {
					n = t.clientX, i = parseInt(r.$cl[0].style[o])
				},
				drag: function(t, e) {
					t = t.clientX - n;
					"right" == r.rtl && (t *= -1), r.$cl[0].style[o] = i + t + "px"
				},
				stop: function(t, e) {
					return r.resizeStop(t, e, n)
				}
			})
		},
		_getDragHelper: function(t) {
			var e = this.that,
				n = +e.options.freezeCols,
				t = u(t.target),
				i = e.$grid_center,
				e = e.iRenderHead,
				t = +t.attr("pq-col-indx"),
				n = t < n ? 0 : e.scrollX(),
				r = i.outerHeight(),
				o = e.getLeft(t) - n,
				e = e.getLeft(1 + t) - n,
				t = "style='height:" + r + "px;" + this.rtl + ":";
			this.$clleft = u("<div class='pq-grid-drag-bar' " + t + o + "px;'></div>").appendTo(i), this.$cl = u("<div class='pq-grid-drag-bar' " + t + e + "px;'></div>").appendTo(i)
		},
		_setDragLimits: function(t) {
			var e, n, i;
			t < 0 || (i = (n = this.that).iRenderHead, n = n.colModel[t], n = (e = i.getLeft(t) + n._minWidth) + n._maxWidth - n._minWidth, (i = u(i._resizeDiv(t))).draggable("instance") && i.draggable("option", "containment", [e, 0, n, 0]))
		},
		columnResize: function(t, e, n) {
			var i, r, o, a = this.that,
				l = a.colModel,
				s = a.options,
				d = s.numberCell;
			s.rtl && (e *= -1), -1 == t ? (i = null, o = (r = parseInt(d.width)) + e, d.width = o) : (i = l[t], o = (r = parseInt(i.width)) + e, i.width = o, i._resized = !0), a.refresh({
				soft: !0
			}), a._trigger("columnResize", n, {
				colIndx: t,
				column: i,
				dataIndx: i ? i.dataIndx : null,
				oldWidth: r,
				newWidth: (i || d).width
			})
		},
		resizeStop: function(t, e, n) {
			this.$clleft.remove(), this.$cl.remove();
			n = t.clientX - n, e = +u(e.helper).attr("pq-col-indx");
			this.columnResize(e, n, t)
		}
	}
}(jQuery), ! function(p) {
	var t = p.paramquery;
	t.cDragColumns = function(n) {
		function t(t, e) {
			return p("<div class='pq-arrow-" + t + " ui-icon " + e + "'></div>").appendTo(n.$grid_center)
		}
		var e = this,
			i = n.options,
			r = i.dragColumns;
		e.that = n, e.$drag_helper = null, e.rtl = i.rtl, e.status = "stop", e.$arrowTop = t("down", r.topIcon), e.$arrowBottom = t("up", r.bottomIcon), e.hideArrows(), r && r.enabled && n.$head_i.on("mousedown", ".pq-grid-col", e.onColMouseDown(e, n))
	}, t.cDragColumns.prototype = {
		dragHelper: function(e, n, i) {
			var r = n.options.dragColumns.rejectIcon;
			return function() {
				e.status = "helper", n.$head_i.find(".pq-grid-col-resize-handle").hide();
				var t = p("<div class='pq-col-drag-helper ui-widget-content ui-corner-all panel panel-default' ><span class='pq-drag-icon ui-icon " + r + "'></span>" + i.pq_title + "</div>");
				return (e.$drag_helper = t)[0]
			}
		},
		getRowIndx: function(t, e, n) {
			for (; n && t[n][e] == t[n - 1][e];) n--;
			return n
		},
		hideArrows: function() {
			this.$arrowTop.hide(), this.$arrowBottom.hide()
		},
		_columnIndexOf: function(t, e) {
			for (var n = 0, i = t.length; n < i; n++)
				if (t[n] == e) return n;
			return -1
		},
		moveColumn: function(t, e, n, i, r) {
			var o = this.that,
				a = "colModel",
				l = o.options[a],
				s = o.headerCells,
				d = o.depth - 1,
				i = null == i ? this.getRowIndx(s, t, d) : i,
				r = null == r ? this.getRowIndx(s, e, d) : r,
				d = s[i][t],
				i = s[r][e],
				t = d.parent,
				s = i.parent,
				r = t ? t[a] : l,
				e = s ? s[a] : l,
				a = r.indexOf(d),
				l = n ? 0 : 1,
				r = e.indexOf(i);
			return o.iCols.move(1, a, r + l, t, s, "dnd")[0]
		},
		onColMouseDown: function(o, a) {
			return function(t) {
				var e, n, i = p(this),
					r = p(t.target);
				t.pq_composed || r.is("input,select,textarea") || r.closest(".pq-grid-row").hasClass("pq-grid-header-search-row") || (n = (e = (i = a.getHeadCell(i)).col) ? e.parent : null, !e || e.nodrag || e._nodrag || n && 1 == n.colSpan || e.empty || o.setDraggable(t, e, i) && (t.pq_composed = !0, n = p.Event("mousedown", t), r.trigger(n)))
			}
		},
		onDrop: function() {
			var a = this,
				l = a.that;
			return function(t, e) {
				var n = +e.draggable.attr("pq-col-indx"),
					e = +e.draggable.attr("pq-row-indx"),
					i = p(this),
					r = +i.attr("pq-col-indx"),
					i = +i.attr("pq-row-indx"),
					o = a.leftDrop;
				a.rtl && (o = !o), !1 !== l._trigger("beforeColumnOrder", null, {
					colIndxDrag: n,
					colIndxDrop: r,
					left: o
				}) && (r = a.moveColumn(n, r, o, e, i)) && l._trigger("columnOrder", null, {
					dataIndx: r.dataIndx,
					column: r,
					oldcolIndx: n,
					colIndx: l.getColIndx({
						column: r
					})
				})
			}
		},
		onStart: function(e, n, i, r) {
			return function(t) {
				if (!1 === n._trigger("columnDrag", t.originalEvent, {
						column: i
					})) return !1;
				e.setDroppables(r)
			}
		},
		onDrag: function(r, o) {
			return function(t, e) {
				r.status = "drag";
				var n, i = p(".pq-drop-hover", o.$head_i);
				0 < i.length ? (r.updateDragHelper(!0), n = i.width(), t = t.clientX - i.offset().left + p(document).scrollLeft(), r.leftDrop = t = t < n / 2, r.showFeedback(i, t)) : (r.hideArrows(), n = p(".pq-drop-hover", o.$top), r.updateDragHelper(!!n.length))
			}
		},
		setDraggable: function(t, e, n) {
			var t = p(t.currentTarget),
				i = this,
				r = i.that;
			if (!t.hasClass("ui-draggable")) return t.draggable({
				distance: 10,
				cursorAt: {
					top: -18,
					left: -10
				},
				zIndex: "1000",
				appendTo: r.element,
				revert: "invalid",
				helper: i.dragHelper(i, r, e),
				start: i.onStart(i, r, e, n),
				drag: i.onDrag(i, r),
				stop: function() {
					r.element && (i.status = "stop", r.$head_i.find(".pq-grid-col-resize-handle").show(), i.hideArrows())
				}
			}), !0
		},
		setDroppables: function(t) {
			for (var e, n, i, r, o, a = this.that, l = t.col, s = t.ri, d = l.leftPos, c = d + l.o_colspan, t = "pq-drop-hover ui-state-highlight", u = {
					hoverClass: t,
					classes: {
						"ui-droppable-hover": t
					},
					accept: ".pq-grid-col",
					tolerance: "pointer",
					drop: this.onDrop()
				}, h = a.$head_i.find(":not(.pq-grid-header-search-row)>.pq-grid-col"), f = h.length; f--;) o = (r = p(h[f])).hasClass("ui-droppable"), i = (n = a.getHeadCell(r)).col, e = n.ri, n = n.ci, i.empty || i == l || i.nodrop || i._nodrop || s < e && d <= n && n < c ? o && r.droppable("destroy") : o || r.droppable(u)
		},
		showFeedback: function(t, e) {
			var n = this.that,
				i = t[0],
				t = t.offset().left - p(n.element).offset().left + (e ? 0 : i.offsetWidth) - 8,
				e = i.offsetTop - 16,
				i = n.$header[0].offsetHeight;
			this.$arrowTop.css({
				left: t,
				top: e,
				display: ""
			}), this.$arrowBottom.css({
				left: t,
				top: i,
				display: ""
			})
		},
		updateDragHelper: function(t) {
			var e = this.that.options.dragColumns,
				n = "removeClass",
				i = "addClass",
				r = e.acceptIcon,
				e = e.rejectIcon,
				o = this.$drag_helper;
			o && o[t ? n : i]("ui-state-error").children("span.pq-drag-icon")[t ? i : n](r)[t ? n : i](e)
		}
	}
}(jQuery), ! function(w) {
	w.paramquery.mixHeaderFilter = {
		_input: function(t, e, n, i, r, o) {
			return ["<input ", ' value="', e = pq.formatEx(t, e, o), "\" name='", t.dataIndx, "' type=text style='", i, "' class='", n, "' ", r, " />"].join("")
		},
		_onKeyDown: function(t, e, n) {
			var i, r = this,
				o = this.that;
			if (t.keyCode === w.ui.keyCode.TAB) {
				var a, l, s = r.getCellIndx(n.closest(".pq-grid-col")[0])[1],
					d = o.colModel,
					c = t.shiftKey,
					u = d[s];
				if ("textbox2" == (u.filterUI || {}).type && (o.scrollColumn({
						colIndx: s
					}), (i = r.getCellEd(s)[1])[0] == n[0] ? c || (a = i[1]) : c && (a = i[0]), a)) return a.focus(), t.preventDefault(), !1;
				for (;;) {
					if (c ? s-- : s++, s < 0 || s >= d.length) break;
					var h = (u = d[s]).filter;
					if (!u.hidden && h) {
						l = !0, o.scrollColumn({
							colIndx: s
						}, function() {
							var t = r.getCellEd(s)[1];
							(t = "textbox2" == (u.filterUI || {}).type ? w(c ? t[1] : t[0]) : t) && t.focus()
						});
						break
					}
				}
				return l || o[c ? "focusHead" : "focus"](), t.preventDefault(), !1
			}
		},
		_textarea: function(t, e, n, i, r) {
			return ["<textarea name='", t, "' style='" + i + "' class='" + n + "' " + r + " >", e, "</textarea>"].join("")
		},
		bindListener: function(o, t, a, l) {
			var s = this.that,
				e = l.filter,
				e = pq.filter.getVal(e),
				d = e[0],
				c = e[1];
			pq.fakeEvent(o, t, s.options.filterModel.timeout), o.off(t).on(t, function(t) {
				var e, n, i = l.filterUI,
					r = i.type,
					i = i.condition;
				if ("checkbox" == r ? e = o.pqval({
						incr: !0
					}) : "textbox2" == r ? (e = w(o[0]).val(), n = w(o[1]).val()) : e = o.val(), e = "" === e ? void 0 : pq.deFormat(l, e, i), n = "" === n ? void 0 : pq.deFormat(l, n, i), d !== e || c !== n) return d = e, c = n, (a = pq.getFn(a)).call(s, t, {
					column: l,
					dataIndx: l.dataIndx,
					value: e,
					value2: n
				})
			})
		},
		betweenTmpl: function(t, e) {
			return ["<div class='pq-from-div'>", t, "</div>", "<span class='pq-from-to-center'>-</span>", "<div class='pq-to-div'>", e, "</div>"].join("")
		},
		createListener: function(t) {
			var e = {},
				i = this.that;
			return e[t] = function(t, e) {
				var n = e.column;
				i.filter({
					rules: [{
						dataIndx: n.filterIndx || e.dataIndx,
						condition: n.filter.condition,
						value: e.value,
						value2: e.value2
					}]
				})
			}, e
		},
		getCellEd: function(t) {
			var e = this.data.length - 1,
				e = w(this.getCell(e, t)),
				t = e.find(".pq-grid-hd-search-field");
			return [e, t]
		},
		onCreateHeader: function() {
			var e = this;
			e.that.options.filterModel.header && e.eachH(function(t) {
				t.filter && e.postRenderCell(t)
			})
		},
		onHeaderKeyDown: function(t, e) {
			var n = w(t.originalEvent.target);
			return !n.hasClass("pq-grid-hd-search-field") || this._onKeyDown(t, e, n)
		},
		postRenderCell: function(e) {
			var n = e.dataIndx,
				i = e.filterUI || {},
				r = e.filter,
				o = this.that,
				a = o.colIndxs[n],
				t = this.getCellEd(a),
				l = t[0],
				s = t[1];
			if (0 != s.length) {
				var d = i.type,
					c = {
						button: "click",
						select: "change",
						checkbox: "change",
						textbox: "timeout",
						textbox2: "timeout"
					},
					t = pq.filter.getVal(r)[0],
					t = ("checkbox" == d ? s.pqval({
						val: t
					}) : "select" == d && (w.isArray(t = t || []) || (t = [t]), e.format && (t = t.slice(0, 25).map(function(t) {
						return pq.format(e, t)
					})), s.val(t.join(", "))), s.on("keydown", function(t) {
						t.keyCode == w.ui.keyCode.ESCAPE && (o.focusHead({
							colIndx: a
						}), t.preventDefault())
					}), i.init),
					u = r.listener,
					h = r.listeners || [u || c[d]];
				t && t.find(function(t) {
					return o.callFn(t, {
						dataIndx: n,
						column: e,
						filter: r,
						filterUI: i,
						$cell: l,
						$editor: s
					})
				});
				for (var f = 0; f < h.length; f++) {
					var p, g = h[f],
						m = typeof g,
						v = {};
					for (p in "string" == m ? g = this.createListener(g) : "function" == m && (v[c[d]] = g, g = v), g) this.bindListener(s, p, g[p], e)
				}
			}
		},
		getControlStr: function(t) {
			var e = this.that,
				n = t.dataIndx,
				i = t.filter,
				r = " ui-corner-all",
				i = pq.filter.getVal(i),
				o = i[0],
				a = i[1],
				i = i[2],
				e = t.filterUI = pq.filter.getFilterUI({
					column: t,
					dataIndx: n,
					condition: i,
					indx: 0
				}, e),
				l = e.type,
				s = "",
				d = ("textbox2" == l && (a = null != a ? a : ""), "pq-grid-hd-search-field " + (e.cls || "")),
				c = e.style || "",
				e = (e.attr || "") + " tabindex=-1";
			return l && 0 <= l.indexOf("textbox") ? (o = null != o ? o : "", d = d + " pq-search-txt" + r, s = "textbox2" == l ? this.betweenTmpl(this._input(t, o, d + " pq-from", c, e, i), this._input(t, a, d + " pq-to", c, e, i)) : this._input(t, o, d, c, e, i)) : "select" === l ? s = "<input type='text' " + ["name='", n, "' class='", d += r, "' style='", c, "' ", e].join("") + " ><span class='ui-icon pq-dd-icon ui-icon-caret-1-s'></span>" : "checkbox" == l ? s = ["<input ", null == o || 0 == o ? "" : "checked=checked", " name='", n, "' type=checkbox class='" + d + "' style='" + c + "' " + e + " />"].join("") : pq.isStr(l) && (s = l), s
		},
		renderFilterCell: function(t, e, n) {
			var i, r = this.that.options,
				o = r.filterModel,
				a = t.cls,
				l = t.halign || t.align;
			return l && n.push("pq-align-" + l), a && n.push(a), n.push(t.clsFilter), t.filter ? (i = this.getControlStr(t)) && n.push("pq-col-" + e) : r.showHeader || "detail" != t.type || (i = this.getTitle(t, e)), (l = this.hasMenu(o, t)) && n.push("pq-has-menu"), ["<div class='pq-td-div' style='overflow:hidden;'>", "", i, "</div>", l ? "<span class='pq-icon-filter'></span>" : ""].join("")
		},
		hasMenu: function(t, e) {
			t = t.menuIcon, e = (e.filter || {}).menuIcon;
			return t && !1 !== e || !1 !== t && e
		}
	}
}(jQuery), ! function(v) {
	var u = v.paramquery.cRefresh = function(t) {
		var e = this,
			n = t.eventNamespace;
		e.vrows = [], (e.that = t).on("dataReadyDone", function() {
			e.addRowIndx(!0)
		}), v(window).on("resize" + n + " orientationchange" + n, e.onWindowResize.bind(e))
	};
	v.extend(u, {
		Z: function() {
			return (window.outerWidth - 8) / window.innerWidth
		},
		cssZ: function() {
			return document.body.style.zoom
		},
		isFullScreen: function() {
			return document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen || window.innerHeight == screen.height
		},
		isSB: function() {
			return v(document).height() > v(window).height()
		}
	}), v(document).one("pq:ready", function() {
		var n = u.Z,
			i = u.cssZ,
			r = n(),
			o = i(),
			e = (u.isZoom = function() {
				var t = n(),
					e = i();
				if (r != t || o != e) return r = t, o = e, !0
			}, u.isSB),
			a = e();
		pq.onResize(document.body, function() {
			var t = e();
			t != a && (a = t, v(window).trigger("resize", {
				SB: !0
			}))
		})
	}), v(window).on("resize", function() {
		u.isZoom && (u.ISZOOM = u.isZoom())
	}), u.prototype = {
		addRT: function(t) {
			var e = this.that.options,
				n = e.dataModel,
				i = e.rowTemplate;
			if (i)
				for (var r, o = t || n.data, a = o.length; a--;)(r = o[a]) && pq.extendT(r, i)
		},
		addRowIndx: function(t) {
			for (var e, n = this.that, i = n.options.dataModel.dataUF, r = n.get_p_data(), o = r.length; o--;)(e = r[o]) && (e.pq_ri = o);
			if (t && i)
				for (o = i.length; o--;) delete i[o].pq_ri
		},
		move: function() {},
		setGridAndCenterHeightForFlex: function() {
			var t = this.that;
			t.element.height(""), t.$grid_center.height(""), t.dims.htGrid = t.element.height()
		},
		setGridWidthForFlex: function() {
			var t = this.that,
				e = t.options,
				n = this.maxWidthPixel,
				i = t.element,
				r = t.$toolPanel[0].offsetWidth + t.iRenderB.getFlexWidth();
			e.maxWidth && r >= this.maxWidthPixel && (r = n), t._trigger("contWd"), i.width(r + "px"), t.dims.wdGrid = r
		},
		_calcOffset: function(t) {
			t = /(-|\+)([0-9]+)/.exec(t);
			return t && 3 === t.length ? parseInt(t[1] + t[2]) : 0
		},
		setMax: function(t) {
			var e = this.that,
				n = e.element,
				e = e.options[t];
			e ? (e == parseInt(e) && (e += "px"), n.css(t, e)) : n.css(t, "")
		},
		refreshGridWidthAndHeight: function() {
			var t, e, n, i = this.that,
				r = i.options,
				o = i.dims,
				a = -1 < (r.width + "").indexOf("%"),
				l = -1 < (r.height + "").indexOf("%"),
				s = -1 < (r.maxHeight + "").indexOf("%"),
				d = "flex" == r.height,
				c = r.dimsRelativeTo,
				u = s && d,
				h = -1 < (r.maxWidth + "").indexOf("%"),
				f = "flex" == r.width,
				p = h && f,
				g = i.element;
			if (this.isReactiveDims()) {
				if (!(m = (c = c ? pq.isFn(c) ? c.call(i) : v(c) : g.parent())[0])) return;
				i._parent2 != m && (i._parent2 = m, pq.onResize(m, this.onWindowResize.bind(this)));
				var i = m == document.body || "fixed" == g.css("position") ? (n = v(window).width(), window.innerHeight || v(window).height()) : (n = c.width(), c.height()),
					m = this._calcOffset,
					c = a ? m(r.width) : 0,
					m = l ? m(r.height) : 0;
				p ? t = parseInt(r.maxWidth) * n / 100 : a && (t = parseInt(r.width) * n / 100 + c), u ? e = parseInt(r.maxHeight) * i / 100 : l && (e = parseInt(r.height) * i / 100 + m)
			}
			t || (f && r.maxWidth ? h || (t = r.maxWidth) : a || (t = r.width)), r.maxWidth && (this.maxWidthPixel = t), e || (d && r.maxHeight ? s || (e = r.maxHeight) : l || (e = r.height)), parseFloat(t) == t ? (t = t < r.minWidth ? r.minWidth : t, g.css("width", t)) : "auto" === t && g.width(t), parseFloat(e) == e && (e = e < r.minHeight ? r.minHeight : e, g.css("height", e)), o.wdGrid = Math.round(g.width()), o.htGrid = Math.round(g.height())
		},
		isReactiveDims: function() {
			function t(t) {
				return -1 != (t + "").indexOf("%")
			}
			var e = this.that.options,
				n = e.width,
				i = e.height,
				r = e.maxWidth,
				e = e.maxHeight,
				o = t(n),
				n = "auto" === n,
				i = t(i),
				r = t(r),
				e = t(e);
			return o || n || i || r || e
		},
		getParentDims: function() {
			var t, e = this.that,
				n = e.element,
				e = e._parent2,
				i = v(e);
			return e ? [e == document.body || "fixed" == n.css("position") ? (t = window.innerHeight || v(window).height(), v(window).width()) : (t = i.height(), i.width()), t] : []
		},
		onWindowResize: function(t, e) {
			var n, i, r = this,
				o = r.that,
				a = o.dims || {},
				l = a.htParent,
				s = a.wdParent,
				d = o.options,
				c = o.element;
			if (d && !u.isFullScreen() && !d.disabled && !(v.support.touch && d.editModel.indices && v(document.activeElement).is(".pq-editor-focus") || e && (o = e.$grid) && (o == c || 0 == c.closest(o).length))) {
				if (d = r.isReactiveDims(), u.ISZOOM) return r.setResizeTimer(function() {
					r.refresh({
						soft: !0
					})
				});
				d && r.setResizeTimer(function() {
					if (i = r.getParentDims(), n = i[0], (i = i[1]) == l && n == s) {
						if (parseInt(c.width()) == parseInt(a.wdGrid)) return
					} else a.htParent = i, a.wdParent = n;
					r.refresh({
						soft: !0
					})
				})
			}
		},
		setResizeTimer: function(t) {
			var e = this,
				n = e.that;
			clearTimeout(e._autoResizeTimeout), e._autoResizeTimeout = window.setTimeout(function() {
				n.element && (t ? t() : e.refreshAfterResize())
			}, n.options.autoSizeInterval || 100)
		},
		refresh: function(t) {
			var e, n = this,
				i = n.that,
				r = null == (t = t || {}).header || t.header,
				o = t.pager,
				a = !t.soft,
				l = i.element,
				s = i.$toolPanel,
				d = i.dims = i.dims || {
					htCenter: 0,
					htHead: 0,
					htSum: 0,
					htBody: 0,
					wdCenter: 0,
					htTblSum: 0
				};
			t.colModel && i.refreshCM(), l[0].offsetWidth ? (s.css("height", "1px"), t.toolbar && i.refreshToolbar(), (e = i.options).collapsible._collapsed = !1, n.setMax("maxHeight"), n.setMax("maxWidth"), n.refreshGridWidthAndHeight(), a && !1 !== o && i._refreshPager(), d.htCenter = n.setCenterHeight(), o = s[0].offsetWidth, d.wdCenter = d.wdGrid - o, i.$grid_center.css("margin" + (e.rtl || "left" == (e.sideBar || {}).align ? "Left" : "Right"), o), i.iRenderB.init({
				header: r,
				soft: t.soft,
				source: t.source
			}), "flex" == e.height && n.setGridAndCenterHeightForFlex(), "flex" == e.width && n.setGridWidthForFlex(), s = this.getParentDims(), d.wdParent = s[0], d.htParent = s[1], a && i._createCollapse(), e.dataModel.postDataOnce = void 0, i._trigger("refreshFull")) : l.addClass("pq-pending-refresh")
		},
		setCenterHeight: function() {
			var t, e = this.that,
				n = e.$top,
				i = e.options;
			return "flex" === i.height && !i.maxHeight || (t = e.dims.htGrid - (i.showTop ? n[0].offsetHeight + parseInt(n.css("marginTop")) : 0) - e.$bottom[0].offsetHeight + 1, e.$grid_center.height(t = 0 <= t ? t : "")), t
		}
	}
}(jQuery), ! function(a) {
	(a.paramquery.cCheckBoxColumn = function(t, e) {
		var n, i = this,
			r = (i.that = t, i.fns = {}, i.options = t.options, (e = (n = i.colUI = e).cbId ? i.colCB = t.columns[e.cbId] : i.colCB = e).cb = a.extend({}, {
				all: !1,
				header: !1,
				select: !1,
				check: !0,
				uncheck: !1
			}, e.cb)),
			o = e.dataIndx;
		n._render = i.cellRender(e, n), i.on("dataAvailable", function() {
			t.one("dataReady", i.oneDataReady.bind(i))
		}).on("dataReady", i.onDataReady.bind(i)).on("valChange", i.onCheckBoxChange(i)).on("cellKeyDown", i.onCellKeyDown.bind(i)).on("refreshHeader", i.onRefreshHeader.bind(i)).on("change", i.onChange(i, t, o, r.check, r.uncheck)), r.select && i.on("rowSelect", i.onRowSelect(i, t)).on("beforeRowSelectDone", i.onBeforeRowSelect(i, t, o, r.check, r.uncheck)), i.on("beforeCheck", i.onBeforeCheck.bind(i))
	}).prototype = a.extend({
		cellRender: function(l, s) {
			var d = this;
			return function(t) {
				var e, n = t.rowData,
					i = l.dataIndx,
					r = l.cb,
					o = s.renderLabel,
					a = s.useLabel;
				if (!(n.pq_gtitle || n.pq_gsummary || t.Export)) return [a ? " <label>" : "", "<input type='checkbox' tabindex='-1' ", r.check === n[i] ? "checked" : "", " ", d.isEditable(n, l, t.rowIndx, this.colModel.indexOf(l), i) ? "" : "disabled", " />", e = null == (e = o ? o.call(this, t) : e) ? l == s ? "" : t.formatVal || t.cellData : e, a ? "</label>" : ""].join("")
			}
		},
		checkAll: function(t, e) {
			var n = this.that,
				n = this.colCB.cb.all ? n.options.dataModel.data : n.pdata;
			return this.checkNodes(n, t = null == t || t, e)
		},
		checkNodes: function(t, e, n) {
			var i, r, o, a, l, s, d, c;
			if (t.length) return i = this.that, r = this.colUI.dataIndx, c = this.colCB, o = c.cb, a = (e = null == e ? !0 : e) ? o.check : o.uncheck, l = c.dataIndx, c = t[0], s = c.pq_ri, d = function() {
				return i.refreshCell({
					rowIndx: s,
					dataIndx: r
				}), !1
			}, t = t.map(function(t) {
				var e = {},
					n = {};
				return e[l] = t[l], n[l] = a, {
					rowIndx: t.pq_ri,
					rowData: t,
					oldRow: e,
					newRow: n
				}
			}), c = {
				rowIndx: s,
				rowData: c,
				dataIndx: r,
				check: e,
				rows: t
			}, e = {
				source: "checkbox"
			}, !1 === i._trigger("beforeCheck", n, c) ? d() : (e.updateList = c.rows, e.history = e.track = !o.select && null, !1 === i._digestData(e) ? d() : void(o.maxCheck || 1 != e.updateList.length ? i.refresh({
				header: !1
			}) : i.refreshRow({
				rowIndx: e.updateList[0].rowIndx
			})))
		},
		isEditable: function(t, e, n, i, r) {
			return this.that.isEditable({
				rowIndx: n,
				rowData: t,
				column: e,
				colIndx: i,
				dataIndx: r
			})
		},
		onBeforeRowSelect: function(a, l, s, d, c) {
			return function(t, e) {
				var n;
				"checkbox" != e.source && ((n = function(t) {
					for (var e, n, i = t.length, r = l.columns[s], o = l.colIndxs[s]; i--;) e = (n = t[i]).rowIndx, n = n.rowData, a.isEditable(n, r, e, o, s) ? n[s] = n.pq_rowselect ? c : d : t.splice(i, 1)
				})(e.addList), n(e.deleteList))
			}
		},
		onChange: function(l, s, d, c, t) {
			return function(n, t) {
				function e(t, e) {
					t.length && s._trigger("check", n, {
						rows: t,
						dataIndx: a,
						rowIndx: t[0].rowIndx,
						rowData: t[0].rowData,
						check: e
					})
				}

				function i(t) {
					t.forEach(function(t) {
						var e = t.newRow,
							n = t.oldRow;
						e.hasOwnProperty(d) && (e[d] === c ? r.push(t) : n && n[d] === c && o.push(t))
					})
				}
				var r = [],
					o = [],
					a = l.colUI.dataIndx;
				l.setValCBox(), i(t.addList), i(t.updateList), l.colCB.cb.select && s.SelectRow().update({
					addList: r,
					deleteList: o,
					source: "checkbox"
				}), e(r, !0), e(o, !1)
			}
		},
		onCheckBoxChange: function(n) {
			return function(t, e) {
				if (e.dataIndx == n.colUI.dataIndx) return n.checkNodes([e.rowData], e.input.checked, t)
			}
		},
		onDataReady: function() {
			this.setValCBox()
		},
		off: function() {
			var t, e = this.fns,
				n = this.that;
			for (t in e) n.off(t, e[t]);
			this.fns = {}
		},
		on: function(t, e) {
			return this.fns[t] = e, this.that.on(t, e), this
		},
		destroy: function() {
			for (var t in this.off(), this) delete this[t]
		},
		oneDataReady: function() {
			var t, e = this.that.get_p_data(),
				n = 0,
				i = e.length,
				r = this.colCB,
				o = r.cb,
				a = r.dataIndx;
			if (null != a && e && o.select)
				for (; n < i; n++)(t = e[n]) && (t[a] === o.check ? t.pq_rowselect = !0 : t.pq_rowselect && (t[a] = o.check))
		},
		onRowSelect: function(n, i) {
			return function(t, e) {
				"checkbox" != e.source && (e.addList.length || e.deleteList.length) && (n.setValCBox(), i.refresh({
					header: !1
				}))
			}
		}
	}, pq.mixin.ChkGrpTree)
}(jQuery), ! function(m) {
	var n = m.paramquery,
		t = {
			options: {
				stateColKeys: {
					width: 1,
					filter: ["crules", "mode"],
					hidden: 1
				},
				stateKeys: {
					height: 1,
					width: 1,
					freezeRows: 1,
					freezeCols: 1,
					groupModel: ["dataIndx", "collapsed", "grandSummary"],
					pageModel: ["curPage", "rPP"],
					sortModel: ["sorter"]
				},
				detailModel: {
					cache: !0,
					offset: 100,
					expandIcon: "ui-icon-triangle-1-se",
					collapseIcon: "ui-icon-triangle-1-e",
					height: "auto"
				},
				dragColumns: {
					enabled: !0,
					acceptIcon: "ui-icon-check",
					rejectIcon: "ui-icon-closethick",
					topIcon: "ui-icon-circle-arrow-s",
					bottomIcon: "ui-icon-circle-arrow-n"
				},
				flex: {
					on: !0,
					one: !1,
					all: !0
				},
				track: null,
				mergeModel: {
					flex: !1
				},
				realFocus: !0,
				sortModel: {
					on: !0,
					type: "local",
					multiKey: "shiftKey",
					number: !0,
					single: !0,
					cancel: !0,
					sorter: [],
					useCache: !0,
					ignoreCase: !1
				},
				filterModel: {
					on: !0,
					newDI: [],
					type: "local",
					mode: "AND",
					header: !1,
					timeout: 400
				}
			},
			_create: function() {
				var t = this,
					e = t.options;
				null == e.rtl && (e.rtl = "rtl" == t.element.css("direction")), t.listeners = {}, t._queueATriggers = {}, t.iHistory = new n.cHistory(t), t.iGroup = new n.cGroup(t), t.iMerge = new n.cMerge(t), t.iFilterData = new n.cFilterData(t), t.iSelection = new pq.Selection(t), t.iUCData = new n.cUCData(t), t.iMouseSelection = new n.cMouseSelection(t), t._super(), new n.cFormula(t), t.iDragColumns = new n.cDragColumns(t), t.refreshToolbar(), "remote" === e.dataModel.location && t.refresh(), t.on("dataAvailable", function() {
					t.one("refreshDone", function() {
						t._trigger("ready"), setTimeout(function() {
							t.element && t._trigger("complete")
						}, 0)
					})
				}), t.refreshDataAndView({
					header: !0
				})
			}
		},
		t = (m.widget("paramquery.pqGrid", n._pqGrid, t), m.widget.extend = function() {
			var t, e, n, i, r, o = Array.prototype.shift,
				a = m.isPlainObject,
				l = m.isArray,
				s = m.widget.extend,
				d = o.apply(arguments),
				c = ("boolean" == typeof d && (t = d, d = o.apply(arguments)), arguments),
				u = 0,
				h = c.length;
			for (null == t && (t = 1 < h); u < h; u++)
				for (i in e = c[u])(r = (n = Object.getOwnPropertyDescriptor(e, i)).get) && "reactiveGetter" != r.name || n.set ? Object.defineProperty(d, i, n) : void 0 !== (r = e[i]) && (n = !(0 < u), a(r) ? r.byRef ? d[i] = r : (d[i] = d[i] || {}, s(n, d[i], r)) : l(r) ? d[i] = t && n ? r.slice() : r : d[i] = r);
			return d
		}, pq.grid = function(t, e) {
			t = m(t).pqGrid(e);
			return t.data("paramqueryPqGrid") || t.data("paramquery-pqGrid")
		}, n.pqGrid.regional = {}, n.pqGrid.prototype);

	function p(t, e, n) {
		for (var i = 0, r = t.length; i < r; i++) {
			for (var o, a = t[i], l = {}, s = 0, d = e.length; s < d; s++) l[o = e[s]] = a[o];
			n.push(l)
		}
	}
	n.pqGrid.defaults = t.options, t.focusT = function(t) {
		var e = this;
		setTimeout(function() {
			e.focus(t)
		})
	}, t.focus = function(t) {
		this.iKeyNav.focus(t)
	}, t.focusHead = function(t) {
		this.iKeyNav.focusHead(t)
	}, t.getFocus = function() {
		return this.iKeyNav.getFocus()
	}, t.callFn = function(t, e) {
		return pq.getFn(t).call(this, e)
	}, t.rowExpand = function(t) {
		this.iHierarchy.rowExpand(t)
	}, t.rowInvalidate = function(t) {
		this.iHierarchy.rowInvalidate(t)
	}, t.rowCollapse = function(t) {
		this.iHierarchy.rowCollapse(t)
	}, t.Detail = function() {
		return this.iHierarchy
	}, t.isFrozenPane = function() {
		var t = this.options;
		return t.freezeRows || t.freezeCols
	}, t.unfreezePanes = function() {
		var t = this.options;
		t.freezeRows = 0, t.freezeCols = 0, this.refresh()
	}, t.freezeTopRow = function() {
		this.options.freezeRows = this.getFirstVisibleRIP() + 1, this.refresh()
	}, t.freezeFirstCol = function() {
		this.options.freezeCols = this.getFirstVisibleCI() + 1, this.refresh()
	}, t._saveState = function(t, e, n) {
		var i, r, o, a;
		for (i in n)(r = n[i]) && (o = t[i], m.isArray(r) ? null != o && (a = e[i] = m.isPlainObject(e[i]) ? e[i] : {}, r.forEach(function(t) {
			a[t] = o[t]
		})) : e[i] = o)
	}, t.saveState = function(t) {
		t = t || {};
		for (var e, n, i, r = this, o = r.element, a = r.options, l = a.stateColKeys, s = a.stateKeys, d = r.colModel, c = [], u = 0, h = d.length, o = o[0].id; u < h; u++) e = (n = d[u]).dataIndx, r._saveState(n, n = {
			dataIndx: e
		}, l), c[u] = n;
		return i = {
			colModel: c,
			datestamp: Date.now()
		}, r._saveState(a, i, s), (a = t.extra) && (i = m.extend(!0, i, a)), !1 !== t.stringify && (i = JSON.stringify(i), !1 !== t.save && "undefined" != typeof Storage && localStorage.setItem("pq-grid" + (o || ""), i)), i
	}, t.getState = function() {
		if ("undefined" != typeof Storage) return localStorage.getItem("pq-grid" + (this.element[0].id || ""))
	}, t.loadState = function(t) {
		var e = this,
			n = m.widget.extend,
			i = (t = t || {}).state || e.getState();
		if (!i) return !1;
		for (var r, o, a, l = (i = pq.isStr(i) ? JSON.parse(i) : i).colModel, s = [], d = [], c = e.options, u = c.stateColKeys, h = 1 < e.depth, f = (h ? e : c).colModel, p = 0, g = l.length; p < g; p++) s[a = (r = l[p]).dataIndx] = r, d[a] = p;
		for (h || f.sort(function(t, e) {
				return d[t.dataIndx] - d[e.dataIndx]
			}), p = 0, g = f.length; p < g; p++)(r = s[a = (o = f[p]).dataIndx]) && e._saveState(r, o, u);
		return e.iCols.init(), n(c.sortModel, i.sortModel), n(c.pageModel, i.pageModel), e.Group().option(i.groupModel, !1), e.Tree().option(i.treeModel, !1), h = {
			freezeRows: i.freezeRows,
			freezeCols: i.freezeCols
		}, isNaN(+c.height) || isNaN(+i.height) || (h.height = i.height), isNaN(+c.width) || isNaN(+i.width) || (h.width = i.width), e.option(h), !1 !== t.refresh && e.refreshDataAndView(), !0
	}, t.refreshToolbar = function() {
		var t, e, n, i, r = this,
			o = r.options,
			a = o.toolbar;
		r._toolbar && (t = r._toolbar).destroy(), a && (i = a.cls || "", e = a.style || "", n = a.attr || "", a = a.items, i = m("<div class='" + i + "' style='" + e + "' " + n + " ></div>"), t ? t.widget().replaceWith(i) : r.$top.append(i), t = pq.toolbar(i, {
			items: a,
			gridInstance: r,
			bootstrap: o.bootstrap
		}), o.showToolbar || i.css("display", "none"), r._toolbar = t)
	}, t.filter = function(t) {
		return this.iFilterData.filter(t)
	}, t.Checkbox = function(t) {
		return this.iCheckBox[t]
	}, t.refreshHeader = function() {
		this.iRenderHead.refreshHS()
	}, t.refreshSummary = function() {
		this.iRenderSum.refreshHS()
	}, t.refreshHeaderFilter = function(t) {
		var t = this.normalize(t),
			e = t.colIndx,
			t = t.column,
			n = this.iRenderHead,
			i = n.rows - 1;
		this.options.filterModel.header && (n.refreshCell(i, e, {}, t), n.postRenderCell(t, e, i))
	}, t.pageData = function() {
		return this.pdata
	}, t.getData = function(t) {
		var e = (t = t || {}).dataIndx,
			n = e ? e.length : 0,
			t = t.data,
			i = !n,
			r = this.columns,
			o = this.options.dataModel,
			a = o.dataPrimary || o.data || [],
			o = o.dataUF || [],
			l = [];
		if (!n) return o.length ? a.concat(o) : a;
		t ? p(t, e, l) : (p(a, e, l), p(o, e, l));
		for (var s = [], n = e.reduce(function(t, e) {
				var n = r[e];
				return n && t.push({
					dataIndx: e,
					dir: "up",
					dataType: n.dataType,
					sortType: n.sortType
				}), t
			}, []), d = {}, c = 0, u = l.length; c < u; c++) {
			var h = l[c],
				f = JSON.stringify(h);
			d[f] || (s.push(h), d[f] = 1)
		}
		return s = this.iSort._sortLocalData(n, s, i)
	}, t.getPlainOptions = function(t, i) {
		var e = t[0];
		return m.isPlainObject(e) ? (e = Object.keys(e))[0] != i && 1 == e.length && (t = t.map(function(t) {
			var e, n = {};
			for (e in t) n[i] = e, n.pq_label = t[e];
			return n
		})) : t = t.map(function(t) {
			var e = {};
			return e[i] = t, e
		}), t
	}, t.getDataCascade = function(t, e, n) {
		var i, r = this,
			o = r.options.filterModel,
			a = o.newDI.slice(),
			e = e ? [e, t] : [t],
			t = a.indexOf(t);
		return "AND" == o.mode && a.length && "remote" != o.type && (0 <= t && a.splice(t, a.length), a.length && (o = a.map(function(t) {
			var e = r.getColumn({
				dataIndx: t
			}).filter;
			return {
				dataIndx: t,
				crules: e.crules || [e],
				mode: e.mode
			}
		}), i = r.filter({
			data: r.getData(),
			mode: "AND",
			rules: o
		}))), e = e.concat(n || []), r.getData({
			data: i,
			dataIndx: e
		})
	}, t.removeNullOptions = function(t, n, e) {
		var i;
		return null == e ? t.filter(function(t) {
			var e = t[n];
			return null != e && "" !== e || (i ? void 0 : (i = !0, !(t[n] = "")))
		}) : t.filter(function(t) {
			t = t[n];
			return null != t && "" !== t
		})
	}, t.get_p_data = function() {
		var t, e = this.options,
			n = e.pageModel,
			i = n.type,
			e = e.dataModel.data,
			r = this.pdata,
			o = [];
		return i ? (n = n.rPP, t = this.riOffset || 0, !r.length && e.length && (r = e.slice(t, t + n)), o = (i = "remote" == i) ? new Array(t) : e.slice(0, t), i = i ? [] : e.slice(t + n), o.concat(r, i)) : r.length ? r : e
	}, t._onDataAvailable = function(t) {
		var e = this,
			n = e.options,
			i = !(t = t || {}).data,
			r = t.source,
			o = t.sort,
			a = [],
			l = n.filterModel,
			s = n.dataModel,
			n = n.sortModel;
		if (e.iRefresh.addRT(t.data), !1 != i && !(e.pdata = []) !== t.trigger && e._trigger("dataAvailable", t.evt, {
				source: r
			}), a = (l && l.on && "local" == l.type && 0 != t.filter ? e.iFilterData.filterLocalData(t) : s).data, "local" == n.type && !1 !== o && (i ? e.sort({
				refresh: !1
			}) : a = e.iSort.sortLocalData(a, !0)), !1 == i) return a;
		e.refreshView(t)
	}, t.reset = function(t) {
		var e = this,
			n = (t = t || {}).sort,
			i = e.options,
			r = !1 !== t.refresh,
			o = m.extend,
			a = t.filter,
			t = t.group;
		(n || a || t) && (n && o(i.sortModel, !0 === n ? {
			sorter: []
		} : n), a && !r && this.iFilterData.clearFilters(e.colModel), t && e.groupOption(!0 === t ? {
			dataIndx: []
		} : t, !1), r && (a ? (e.filter({
			oper: "replace",
			rules: []
		}), e.refreshHeader()) : n ? e.sort() : e.refreshView()))
	}, t._trigger = n._trigger, t.on = n.on, t.one = n.one, t.off = n.off, t.pager = function() {
		var t;
		return this.pageI = this.pageI || ((t = this.widget().find(".pq-pager")).length ? t.pqPager("instance") : null), this.pageI
	}, t.toolbar = function(t) {
		var e = (this._toolbar || {}).element;
		return t ? e.find(t) : e
	}, t.Columns = function() {
		return this.iCols
	}
}(jQuery), ! function(n) {
	var d = n.paramquery;
	d.cColModel = function(t) {
		this.that = t, this.vciArr, this.ciArr, this.init()
	}, d.cColModel.prototype = {
		add: function(e, n, t, i) {
			var r, o, a = this,
				l = a.that,
				t = t || l.options.colModel,
				n = null == n ? t.length : n,
				s = {
					args: arguments
				},
				d = e.length,
				c = [n, 0].concat(e);
			!1 !== l._trigger("beforeColAdd", null, s) && ("undo" != i && "redo" != i && l.iHistory.push({
				callback: function(t) {
					o = (r || {}).colModel, t ? a.add(e, n, o, "redo") : a.remove(d, n, o, "undo")
				}
			}), t.splice.apply(t, c), l.refreshCM(), r = t[0].parent, l._trigger("colAdd", null, s), l.refresh())
		},
		move: function(e, n, i, r, o, t) {
			var a, l = this,
				s = {
					args: arguments
				},
				d = l.that,
				c = [],
				u = d.options.colModel,
				h = (r || {}).colModel || u,
				f = (o || {}).colModel || u;
			return !1 !== d._trigger("beforeColMove", null, s) && ("undo" != t && "redo" != t && d.iHistory.push({
				callback: function(t) {
					t ? l.move(e, n, i, r, o, "redo") : l.move(e, a, h == f && a < n ? n + e : n, o, r, "undo")
				}
			}), c = h.splice(n, e), a = h == f && n + e < i ? i - e : i, f.splice.apply(f, [a, 0].concat(c)), d.refreshCM(), d._trigger("colMove", null, s), d.refresh()), c
		},
		remove: function(e, n, t, i) {
			var r, o, a = this,
				l = {
					args: arguments
				},
				s = a.that,
				t = (s.iCheckBox, t || s.options.colModel),
				d = t[0].parent;
			!1 !== s._trigger("beforeColRemove", null, l) && ("undo" != i && "redo" != i && s.iHistory.push({
				callback: function(t) {
					o = (d || {}).colModel, t ? a.remove(e, n, o, "redo") : a.add(r, n, o, "undo")
				}
			}), r = t.splice(n, e), s.refreshCM(), s._trigger("colRemove", null, l), s.refresh())
		},
		alter: function(t) {
			var e = this.that;
			t.call(e), e.refreshCM(), e.refresh()
		},
		setRowSpan: function(t) {
			for (var e, n, i, r, o = t[0].length, a = t.length, l = 0; l < o; l++)
				for (n = 0; n < a; n++)
					if (e = t[n][l], !(0 < l && e == t[n][l - 1] || 0 < n && e == t[n - 1][l])) {
						for (i = n + (r = 1); i < a; i++) e == t[i][l] && r++;
						e.rowSpan = r
					} return t
		},
		noRowSpan: function(t) {
			for (var e, n, i, r = t[0].length, o = t.length, a = 0; a < r; a++)
				for (i = 0; i < o; i++)(e = t[i][a]) == (n = (t[i + 1] || {})[a]) ? t[i][a] = {
					hidden: n.hidden,
					empty: !0
				} : e.rowSpan = 1;
			return t
		},
		autoGenColumns: function() {
			var t = this.that.options,
				e = t.columnTemplate || {},
				i = e.dataType,
				r = e.title,
				o = e.width,
				e = t.dataModel.data,
				a = pq.valid,
				l = [];
			e && e.length && (e = e[0], n.each(e, function(t, e) {
				var n = "string";
				a.isInt(e) ? n = -1 < e + "".indexOf(".") ? "float" : "integer" : a.isDate(e) ? n = "date" : a.isFloat(e) && (n = "float"), l.push({
					dataType: i || n,
					dataIndx: t,
					title: r || t,
					width: o || 100
				})
			})), t.colModel = l
		},
		cacheIndices: function() {
			for (var t = this.that, e = "JSON" == this.getDataType(), n = {}, i = {}, r = {}, o = t.colModel, a = 0, l = o.length, s = 0, d = this.vciArr = [], c = this.ciArr = []; a < l; a++) {
				var u = o[a],
					h = u.dataIndx;
				null == h && ("pq_detail" == (h = "detail" == u.type ? "pq_detail" : e ? "dataIndx_" + a : a) && (u.dataType = "object"), u.dataIndx = h), n[h] = u, i[h] = a, u.validations && (r[h] = r), u.hidden || u.noFocus || (d[c[s] = a] = s, s++), u.align || !(h = u.dataType) || "integer" != h && "float" != h || (u.align = "right")
			}
			t.columns = n, t.colIndxs = i, t.validations = r
		},
		collapse: function(t) {
			var e, n, i, r = t.collapsible,
				o = r.on || !1,
				a = t.colModel || [],
				t = a.length,
				l = t,
				s = 0,
				d = r.last,
				c = d ? t - 1 : 0;
			if (t) {
				for (; l--;) e = a[l], null === d ? (i = e.showifOpen === o) && s++ : i = c !== l && o, (e.hidden = i) || !(n = e.colModel) || e.collapsible || this.each(function(t) {
					t.hidden = i
				}, n);
				s == t && this.each(function(t) {
					t.hidden = !1
				}, [a[0]])
			}
		},
		each: function(e, t) {
			var n = this.that;
			(t || n.options.colModel).forEach(function(t) {
				e.call(n, t), t.colModel && this.each(e, t.colModel)
			}, this)
		},
		extend: function(t, e) {
			for (var n = t.length; n--;) {
				var i = t[n];
				e && pq.extendT(i, e)
			}
		},
		find: function(t, e) {
			for (var n, i = this.that, r = e || i.options.colModel, o = 0, a = r.length; o < a; o++) {
				if (n = r[o], t.call(i, n)) return n;
				if (n.colModel && (n = this.find(t, n.colModel))) return n
			}
		},
		getHeaderCells: function(t) {
			for (var e, n = this.that.options, i = this.nestedCols(t), r = i.depth, i = i.colModel, o = i.length, a = [], l = 0; l < r; l++) {
				a[l] = [];
				for (var s = 0, d = 0, c = 0; c < o; c++) {
					if (0 == l) e = t[s];
					else {
						var u = a[l - 1][c],
							h = u.colModel;
						if (h && 0 != h.length) {
							for (var f = c - u.leftPos, p = 0, g = 0, m = 0; m < h.length; m++)
								if (f < (p += 0 < h[m].childCount ? h[m].childCount : 1)) {
									g = m;
									break
								} e = h[g]
						} else e = u
					}
					u = e.childCount || 1, c == d ? (e.leftPos = c, a[l][c] = e, d += u, t[s + 1] && s++) : a[l][c] = a[l][c - 1]
				}
			}
			return this[n.rowSpanHead ? "setRowSpan" : "noRowSpan"](a), [a, i]
		},
		getDataType: function() {
			var t = this.colModel;
			if (t && t[0]) return t = t[0].dataIndx, pq.isStr(t) ? "JSON" : "ARRAY"
		},
		getci: function(t) {
			return this.ciArr[t]
		},
		getvci: function(t) {
			return this.vciArr[t]
		},
		getNextVisibleCI: function(t) {
			for (var e = this.vciArr, n = this.that.colModel.length; t < n; t++)
				if (null != e[t]) return t
		},
		getPrevVisibleCI: function(t) {
			for (var e = this.vciArr; 0 <= t; t--)
				if (null != e[t]) return t
		},
		getLastVisibleCI: function() {
			var t = this.ciArr;
			return t[t.length - 1]
		},
		getVisibleTotal: function() {
			return this.ciArr.length
		},
		hide: function(t) {
			var e = this.that,
				n = e.columns;
			t.diShow = t.diShow || [], t.diHide = t.diHide || [], !1 !== e._trigger("beforeHideCols", null, t) && (t.diShow = t.diShow.filter(function(t) {
				t = n[t];
				if (t.hidden) return delete t.hidden, !0
			}), t.diHide = t.diHide.filter(function(t) {
				t = n[t];
				if (!t.hidden) return t.hidden = !0
			}), e._trigger("hideCols", null, t), e.refresh({
				colModel: !0
			}))
		},
		init: function(t) {
			var e = this,
				n = e.that,
				i = n.options,
				r = i.columnTemplate,
				o = i.colModel;
			o || (e.autoGenColumns(), o = i.colModel), i = e.getHeaderCells(o), o = n.headerCells = i[0], n.depth = o.length, o = n.colModel = i[1], r && e.extend(o, r), e.cacheIndices(), e.initTypeColumns(), n._trigger("CMInit", null, t)
		},
		initTypeColumns: function() {
			var t, e = this.that,
				n = e.colModel,
				i = 0,
				r = n.length,
				o = e.columns,
				a = e.iCheckBox = e.iCheckBox || {};
			for (t in a) a[t].colUI != o[t] && (a[t].destroy(), delete a[t]);
			for (; i < r; i++) {
				var l = n[i],
					s = l.type;
				s && ("checkbox" == s || "checkBoxSelection" == s ? (t = l.dataIndx, l.type = "checkbox", a[t] = a[t] || new d.cCheckBoxColumn(e, l)) : "detail" != s || e.iHierarchy || (l.dataIndx = "pq_detail", e.iHierarchy = new d.cHierarchy(e, l)))
			}
		},
		nestedCols: function(t, e, n, i) {
			for (var r = t.length, o = [], a = "skipExport", l = 0, s = e = e || 1, d = 0, c = 0, u = 0; l < r; l++) {
				var h = t[l],
					f = h.colModel;
				h.parent = i, !0 === n && (h.hidden = n), i && i[a] && null == h[a] && (h[a] = !0), f && f.length ? (h.collapsible && this.collapse(h), f = this.nestedCols(f, e + 1, h.hidden, h), o = o.concat(f.colModel), 0 < f.colSpan ? (f.depth > s && (s = f.depth), h.colSpan = f.colSpan, d += f.colSpan) : h.colSpan = 0, u += f.o_colspan, h.o_colspan = f.o_colspan, h.childCount = f.childCount, c += f.childCount) : (h.hidden ? h.colSpan = 0 : (h.colSpan = 1, d++), u++, h.o_colspan = 1, h.childCount = 0, c++, o.push(h))
			}
			return {
				depth: s,
				colModel: o,
				colSpan: d,
				width: 0,
				childCount: c,
				o_colspan: u
			}
		},
		reduce: function(n, t) {
			var i = this.that,
				r = [];
			return (t || i.options.colModel).forEach(function(t, e) {
				t = n.call(i, t, e);
				t && ((e = t.colModel) && e.length ? (e = this.reduce(n, e)).length && (t.colModel = e, r.push(t)) : r.push(t))
			}, this), r
		},
		reverse: function(t) {
			var e, n = this,
				i = n.that;
			(t || i.options.colModel).reverse().forEach(function(t) {
				(e = t.colModel) && n.reverse(e)
			}), t || i.refreshCM()
		}
	}
}(jQuery), ! function(R) {
	function t(t, e) {
		var n, i = this,
			r = t.options.detailModel;
		i.that = t, i.type = "detail", i.refreshComplete = !0, i.rowHtDetail = "auto" == (n = r.height) ? 1 : n, t.on("cellClick headerCellClick cellKeyDown", i.onClick.bind(i)).on("beforeViewEmpty", i.onBeforeViewEmpty.bind(i)).on("autoRowHeight", i.onAutoRowHeight.bind(i)).one("render", function() {
			t.iRenderB.removeView = i.removeView(i, t), t.iRenderB.renderView = i.renderView(i, t)
		}).one("destroy", i.onDestroy.bind(i)).on("columnResize", i.onColumnResize.bind(i)), e._render = i.renderCell.bind(i), r.header && (e.title = function() {
			return "<div class='pq-icon-detail ui-icon " + (r.expandAll ? r.expandIcon : r.collapseIcon) + "'></div>"
		})
	}
	R.extend(R.paramquery.pqGrid.prototype, {
		parent: function() {
			return this._parent
		},
		child: function(t) {
			return ((this.normalize(t).rowData || {}).pq_detail || {}).child
		}
	}), (R.paramquery.cHierarchy = t).prototype = {
		detachCells: function(t) {
			t.children().detach(), t.remove()
		},
		onColumnResize: function() {
			var n = this,
				i = n.getPadding();
			n.that.iRenderB.eachV(function(t, e) {
				R("#" + n.getId(e)).css(i)
			})
		},
		getCls: function() {
			return "pq-detail-cont-" + this.that.uuid
		},
		getId: function(t) {
			return "pq-detail-" + t + "-" + this.that.uuid
		},
		getRip: function(t) {
			return +t.id.split("-")[2]
		},
		onAutoRowHeight: function() {
			var i = this,
				r = this.that.iRenderB;
			r.$ele.find("." + i.getCls()).each(function(t, e) {
				var n = i.getRip(e),
					n = r.getHeightCell(n);
				R(e).css("top", n)
			})
		},
		onBeforeViewEmpty: function(t, e) {
			var n = e.rowIndxPage,
				i = this.that.iRenderB,
				e = e.region,
				r = 0 <= n ? "#" + this.getId(n) : "." + this.getCls(),
				n = (0 <= n ? i.$ele : i["$c" + e]).find(r);
			this.detachCells(n)
		},
		onDestroy: function() {
			(this.that.getData() || []).forEach(function(t) {
				t.child && t.child.remove()
			})
		},
		onResize: function(a, e) {
			var n, i = [];
			pq.onResize(e[0], function() {
				var t = a.that.widget();
				t && !t.is(":hidden") && (i.push(e[0]), clearTimeout(n), n = setTimeout(function() {
					var r = a.that.pdata,
						o = [];
					i.forEach(function(t) {
						var e, n, i;
						document.body.contains(t) && (e = a.getRip(t), t = t.offsetHeight, (i = (n = r[e]).pq_detail.height || a.rowHtDetail) != t && (n.pq_detail.height = t, o.push([e, t - i])))
					}), i = [], o.length && (a.that._trigger("onResizeHierarchy"), a.softRefresh(o))
				}, 150))
			})
		},
		removeView: function(d, t) {
			var c = t.iRenderB.removeView;
			return function(t, e, n) {
				for (var i, r, o = c.apply(this, arguments), a = d.getCls(), l = this.getCellRegion(t, n), s = t; s <= e; s++)(i = this.getRow(s, l)) && 1 == i.children.length && 1 == (r = R(i).children("." + a)).length && (d.detachCells(r), i.parentNode.removeChild(i));
				return o
			}
		},
		getPadding: function() {
			var t = this.that,
				e = t.options,
				n = {},
				t = t.dims.wdContLeft + 5;
			return n["padding" + (e.rtl ? "Right" : "Left")] = t, n
		},
		renderView: function(I, q) {
			var _ = q.iRenderB.renderView;
			return function(t, e, n, i) {
				var r, o = _.apply(this, arguments),
					a = q.iRenderB,
					l = I.getCls() + " pq-detail",
					s = q.options,
					d = I.getPadding(),
					c = s.freezeRows,
					u = s.detailModel,
					h = u.init,
					f = this.data;
				if (I.refreshComplete) {
					for (I.refreshComplete = !1, r = t; r <= e; r++)
						if ((v = f[r]) && !v.pq_hidden) {
							var p = v.pq_detail = v.pq_detail || {},
								g = p.show,
								m = p.child;
							if (g) {
								m || pq.isFn(h) && (m = h.call(q, {
									rowData: v
								}), p.child = m);
								var g = m.parent(),
									v = a.getHeightCell(r),
									p = "position:absolute;left:0;top:" + v + "px;padding:5px;width:100%;overflow:hidden;";
								if (g.length) {
									if (!document.body.contains(g[0])) throw "incorrectly detached detail";
									g.css({
										top: v
									})
								} else g = R("<div role='gridcell' id='" + I.getId(r) + "' class='" + l + "' style='" + p + "'></div>").append(m), R(a.getRow(r, r < c ? "tr" : "right")).append(g), "auto" == u.height && I.onResize(I, g);
								g.css(d);
								for (var w, x, y = g.find(".pq-grid"), C = 0, b = y.length; C < b; C++)(x = (w = R(y[C])).pqGrid("instance"))._parent = q, w.hasClass("pq-pending-refresh") && w.is(":visible") && (w.removeClass("pq-pending-refresh"), x.refresh())
							}
						} return I.refreshComplete = !0, o
				}
			}
		},
		renderCell: function(t) {
			var e = this.that.options.detailModel,
				n = t.cellData,
				t = t.rowData;
			return t.pq_gsummary || t.pq_gtitle ? "" : "<div class='pq-icon-detail ui-icon " + (n && n.show ? e.expandIcon : e.collapseIcon) + "'></div>"
		},
		rowInvalidate: function(t) {
			var t = this.that.getRowData(t),
				e = t.pq_detail,
				e = e ? e.child : null;
			e && (e.remove(), t.pq_detail.child = null)
		},
		rowExpand: function(t) {
			var e = this.that,
				t = e.normalize(t),
				n = e.options,
				i = t.rowData,
				r = t.rowIndxPage,
				n = n.detailModel;
			i && !1 !== e._trigger("beforeRowExpand", null, t) && ((e = i.pq_detail = i.pq_detail || {}).show = !0, n.cache || this.rowInvalidate(t), this.softRefresh([
				[r, e.height || this.rowHtDetail]
			], t))
		},
		rowCollapse: function(t) {
			var e = this.that,
				n = e.options,
				t = e.normalize(t),
				i = t.rowData,
				r = t.rowIndxPage,
				n = n.detailModel,
				i = i ? i.pq_detail : null;
			i && i.show && !(t.close = !0) !== e._trigger("beforeRowExpand", null, t) && (n.cache || this.rowInvalidate(t), i.show = !1, this.softRefresh([
				[r, -(i.height || this.rowHtDetail)]
			], t))
		},
		softRefresh: function(t, e) {
			var n = this.that,
				i = n.iRenderB;
			i.initRowHtArrDetailSuper(t), i.setPanes(), i.setCellDims(!0), e && n.refreshRow(e), i.refresh()
		},
		onClick: function(t, e) {
			var n = e.column,
				i = t.originalEvent,
				r = t.keyCode,
				o = R.ui.keyCode,
				a = i.type;
			n && n.type == this.type && ("click" == a && R(i.target).hasClass("ui-icon") || r == o.ENTER || r == o.SPACE) && this[e.rowData ? "toggle" : "toggleAll"](e, t)
		},
		toggle: function(t, e) {
			var n = t.rowData,
				t = t.rowIndx;
			n.pq_gtitle || n.pq_gsummary || this[(n.pq_detail || {}).show ? "rowCollapse" : "rowExpand"]({
				rowIndx: t
			})
		},
		toggleAll: function() {
			var n, i = this,
				t = i.that,
				e = t.options.detailModel,
				r = !e.expandAll,
				o = [];
			t.pdata.forEach(function(t, e) {
				t = t.pq_detail = t.pq_detail || {};
				t.show != r && (t.show = r, n = t.height || i.rowHtDetail, o.push([e, r ? n : -1 * n]))
			}), e.expandAll = r, i.softRefresh(o), t.refresh()
		}
	}
}(jQuery), ! function(l) {
	function t(t) {
		this.that = t, this.class = "pq-grid-overlay", this.rtl = t.options.rtl ? "right" : "left", this.ranges = [], t.on("assignTblDims", this.onRefresh(this, t))
	}(l.paramquery.cCells = t).prototype = {
		addBlock: function(t, e) {
			var n, i, r, o, a, l, s, d, c, u, h, f, p, g, m, v, w, x, y, C;
			t && this.addUnique(this.ranges, t) && (i = (n = this.that).options, d = t.r1, l = t.c1, u = t.r2, t = t.c2, o = (r = a = (i.noBorderSelection ? "pq-no-border " : "") + this.serialize(d, l, u, t)) + " pq-number-overlay", a = a + " pq-head-overlay", f = n.iRenderB, c = function(t, e) {
				return f.getCellCont(t, e)
			}, (m = this.shiftRC(d, l, u, t)) && (d = m[0], l = m[1], u = m[2], t = m[3], C = c(d, l), s = c(u, t), p = (m = f.getCellXY(d, l))[0], g = m[1], v = (m = f.getCellCoords(u, t))[2], x = (w = m[3]) - g, y = v - p, C == s ? this.addLayer(p, g, x, y, r, C, (y ? "" : "border-left:0;border-right:0; ") + (x ? "" : "border-top:0;border-bottom:0;")) : (d = c(d, t), c = c(u, l), u = C[0].offsetWidth, h = C[0].offsetHeight, c == C ? (this.addLayer(p, g, x, u - p, r, C, "border-right:0;"), this.addLayer(0, g, x, v, r, s, "border-left:0;")) : C == d ? (this.addLayer(p, g, h - g, y, r, C, "border-bottom:0;"), this.addLayer(p, 0, w, y, r, s, "border-top:0;")) : (this.addLayer(p, g, h - g, u - p, r, C, "border-right:0;border-bottom:0"), this.addLayer(0, g, h - g, v, r, d, "border-left:0;border-bottom:0"), this.addLayer(p, 0, w, u - p, r, c, "border-right:0;border-top:0"), this.addLayer(0, 0, w, v, r, s, "border-left:0;border-top:0"))), y = i.numberCell.outerWidth || 0, this.addLayer(0, g, x, y, o, f.$clt, ""), this.addLayer(0, g, x, y, o, f.$cleft, ""), 0 != i.showHeader && (p = (m = (f = n.iRenderHead).getCellXY(0, l))[0], g = m[1], v = (m = f.getCellCoords(n.headerCells.length - 1, t))[2], x = (w = m[3]) - g, C = f.$cright, this.addLayer(p, g, x, y = v - p, a, C, ""), C = f.$cleft, this.addLayer(p, g, x, y, a, C, ""))))
		},
		addLayer: function(t, e, n, i, r, o, a) {
			t = this.rtl + ":" + t + "px;top:" + e + "px;height:" + n + "px;width:" + i + "px;" + (a || "");
			l("<svg class='" + this.class + " " + r + "' style='" + t + "'></svg>").appendTo(o)
		},
		addUnique: function(t, e) {
			if (!t.filter(function(t) {
					return e.r1 == t.r1 && e.c1 == t.c1 && e.r2 == t.r2 && e.c2 == t.c2
				})[0]) return t.push(e), !0
		},
		getLastVisibleFrozenCI: function() {
			for (var t = this.that, e = t.colModel, n = t.options.freezeCols - 1; 0 <= n; n--)
				if (!e[n].hidden) return n
		},
		getLastVisibleFrozenRIP: function() {
			for (var t = this.that, e = t.get_p_data(), n = t.riOffset, i = t.options.freezeRows + n - 1; n <= i; i--)
				if (!e[i].pq_hidden) return i - n
		},
		getSelection: function() {
			var t = this.that,
				s = t.get_p_data(),
				d = t.colModel,
				c = [];
			return this.ranges.forEach(function(t) {
				for (var e, n, i = t.r1, r = t.r2, o = t.c1, a = t.c2, l = i; l <= r; l++)
					for (e = s[l], n = o; n <= a; n++) c.push({
						dataIndx: d[n].dataIndx,
						colIndx: n,
						rowIndx: l,
						rowData: e
					})
			}), c
		},
		isSelected: function(t) {
			var t = this.that.normalize(t),
				r = t.rowIndx,
				o = t.colIndx;
			return null == o || null == r ? null : !!this.ranges.find(function(t) {
				var e = t.r1,
					n = t.r2,
					i = t.c1,
					t = t.c2;
				if (e <= r && r <= n && i <= o && o <= t) return !0
			})
		},
		onRefresh: function(e, t) {
			var n;
			return function() {
				clearTimeout(n), n = setTimeout(function() {
					t.element && (e.removeAll(), t.Selection().address().forEach(function(t) {
						e.addBlock(t)
					}))
				}, 50)
			}
		},
		removeAll: function() {
			var t = this.that,
				e = t.$cont;
			e && (e.children().children().children("svg").remove(), t.$head_i.children().children("svg").remove()), this.ranges = []
		},
		removeBlock: function(t) {
			var e, n, i, r, o;
			t && (e = t.r1, n = t.c1, i = t.r2, r = t.c2, t = this.that, 0 <= (o = this.ranges.findIndex(function(t) {
				return e == t.r1 && n == t.c1 && i == t.r2 && r == t.c2
			})) && (this.ranges.splice(o, 1), o = "." + this.class + "." + this.serialize(e, n, i, r), t.$cont.find(o).remove(), t.$head_i.find(o).remove()))
		},
		serialize: function(t, e, n, i) {
			return "r1" + t + "c1" + e + "r2" + n + "c2" + i
		},
		shiftRC: function(t, e, n, i) {
			var r = this.that,
				o = (r.iMerge, r.options),
				a = r.pdata.length,
				o = o.freezeRows,
				l = r.riOffset;
			if (n -= l, !(a <= (t = (t -= l) < o ? Math.max(t, Math.min(0, n)) : t) || n < 0)) return t = t + l - l, n = (n = Math.min(n, a - 1)) + l - l, [t = Math.max(t, 0), e, n = Math.min(n, a - 1), i = Math.min(i, r.colModel.length - 1)]
		}
	}
}(jQuery), ! function(v) {
	v.paramquery.pqGrid.prototype.Range = function(t, e) {
		return new pq.Range(this, t, "range", e)
	};
	var r = pq.Range = function(t, e, n, i) {
		if (null == t) throw "invalid param";
		if (this.that = t, this._areas = [], this instanceof r == 0) return new r(t, e, n, i);
		this._type = n || "range", this.init(e, i)
	};

	function e(t) {
		t.shiftKey && "pqGrid:mousePQUp" != t.type || (this._trigger("selectEnd", null, {
			selection: this.Selection()
		}), this.off("mousePQUp", e), this.off("keyUp", e))
	}
	r.prototype = v.extend({
		add: function(t) {
			this.init(t)
		},
		address: function() {
			return this._areas
		},
		addressLast: function() {
			var t = this.address();
			return t[t.length - 1]
		},
		history: function(r) {
			function n(s) {
				function t(t, e, n, i) {
					for (var r in t) {
						var o, a = t[r][i],
							l = (s ? e : n)[r],
							l = v.extend(!0, {}, l);
						for (o in a) a[o] = l[o];
						for (o in l) a[o] = l[o]
					}
				}
				t(d, i, o, g), t(f, h, u, r), t(c, l, a, m), p.refresh()
			}
			var o = {},
				i = {},
				a = {},
				l = {},
				d = {},
				c = {},
				u = {},
				h = {},
				f = {},
				p = this.that,
				g = "pq_cell" + r,
				m = "pq_row" + r;
			return {
				add: function(t, e, n) {
					function i(t, e, n, i, r) {
						e = t[e];
						n[e] || (i[e] = t, n[e] = v.extend(!0, {}, t[r]))
					}
					n ? i(t, "pq_ri", o, d, g) : e ? i(e, "dataIndx", u, f, r) : i(t, "pq_ri", a, c, m)
				},
				push: function() {
					function t(t) {
						return Object.keys(t).length
					}

					function e(t, e, n) {
						for (var i in t) e[i] = v.extend(!0, {}, t[i][n])
					}(t(d) || t(f) || t(c)) && (e(d, i, g), e(f, h, r), e(c, l, m), p.iHistory.push({
						callback: n
					}))
				}
			}
		},
		refreshStop: function() {
			this._stop = !0
		},
		refresh: function() {
			this.that.refresh(), this._stop = !1
		},
		setAPS: function(c, u, h) {
			function f(t, e, n, i) {
				null == n && !t[r] || (m = (m = t[r] = t[r] || {})[e] = m[e] || {})[i] == n || (C.add(t, null, !0), m[i] = n, "link" == i && null == t[e] && (t[e] = ""))
			}
			var p, g, m, v = this,
				w = v.that,
				r = "pq_cell" + h,
				x = "pq_row" + h,
				y = "attr" == h,
				C = v.history(h);
			v.each(function(e, n, t, i, r, o, a, l, s, d) {
				p = "row" == i, !(g = "column" == i) && !p || y ? 0 == c.indexOf("border") ? v.setAPSBorder(c, u, r, o, a, l, s, d).forEach(function(t) {
					f(e, n, u, t)
				}) : f(e, n, u, c) : ((m = g ? (v.addProp(t), t[h] = t[h] || {}) : e[x] = e[x] || {})[c] != u && (g ? C.add(null, t) : C.add(e), m[c] = u), w.Range(g ? {
					c1: o,
					c2: o
				} : {
					r1: r,
					r2: r
				}, !1).each(function(t, e) {
					var n;
					g && null != (t[x] || {})[c] && (n = u), f(t, e, n, c)
				}, !0))
			}, y), C.push(), v._stop || v.refresh()
		},
		setAPSBorder: function(t, e, n, i, r, o, a, l) {
			var s = [],
				d = this.metaVal,
				c = "inner" == d,
				r = n == r,
				n = n == a,
				a = i == o,
				o = i == l,
				i = "border-",
				l = i + "left",
				u = i + "right",
				h = i + "top",
				i = i + "bottom",
				f = [h, i, l, u, "border"];
			return "border" == t ? "outer" == d ? r || n ? (s = [r ? h : i], (a || o) && (s[1] = a ? l : u)) : (a || o) && (s = [a ? l : u]) : c ? (o || (s = [u]), n || s.push(i)) : e ? (s = [u, i], a && s.push(l), r && s.push(h)) : s = f : t == l ? a && (s = [l]) : t == u ? (c && !o || !c && o) && (s = [u]) : t == h ? r && (s = [h]) : t == i && (c && !n || !c && n) && (s = [i]), s
		},
		border: function(t, e, n) {
			var i = null == (i = {
				all: "",
				outer: "",
				inner: "",
				none: "",
				vertical: "right",
				horizontal: "bottom"
			} [t]) ? t : i;
			this.style("border" + (i ? "-" + i : ""), "none" == t ? "" : e + " " + n, {
				vertical: "inner",
				horizontal: "inner",
				outer: "outer",
				inner: "inner",
				all: "all"
			} [t])
		},
		addProp: function(e) {
			e.prop = e.prop || {
				get align() {
					return e.align
				},
				set align(t) {
					e.align = t
				},
				get format() {
					return e.format
				},
				set format(t) {
					e.format = t
				},
				get valign() {
					return e.valign
				},
				set valign(t) {
					e.valign = t
				},
				get edit() {
					return e.editable
				},
				set edit(t) {
					e.editable = t
				}
			}
		},
		setAttr: function(t, e) {
			this.setAPS(t, e, "attr")
		},
		setStyle: function(t, e) {
			this.setAPS(t, e, "style")
		},
		setProp: function(t, e) {
			this.setAPS(t, e, "prop")
		},
		clear: function() {
			return this.copy({
				copy: !1,
				cut: !0,
				source: "clear"
			})
		},
		clearOther: function(t) {
			for (var e = this._normal(t, !0), n = this.address(), i = n.length - 1; 0 <= i; i--) {
				var r = n[i];
				r.r1 == e.r1 && r.c1 == e.c1 && r.r2 == e.r2 && r.c2 == e.c2 || n.splice(i, 1)
			}
		},
		clone: function() {
			return this.that.Range(this._areas)
		},
		_cellAttr: function(t, e) {
			t = t.pq_cellattr = t.pq_cellattr || {};
			return t[e] = t[e] || {}
		},
		comment: function(t) {
			return this.attr("title", t)
		},
		link: function(t) {
			return this.prop("link", t)
		},
		pic: function(e, n, i) {
			var r = this.that.Pic(),
				a = 0,
				l = 0;
			this.each(function(t, e, n, i, r, o) {
				return a = r, l = o, !1
			}), pq.fileToBase(e, function(t) {
				r.add(r.name(e.name), t, [l, n || 0, a, i || 0])
			})
		},
		_copyArea: function(t, e, n, i, r, o, a, l, s, d, c, u, h, f) {
			for (var p, g, m, v, w, x, y = this.that, C = y.readCell, b = this.getRenderVal, I = y.iMerge, q = [], _ = [], R = [], D = y.riOffset, M = y.iRenderB, T = n; T <= i; T++) x = (w = r[T]).dataType, q[T] = !x || "string" == x || "html" == x, !1 === (_[T] = w.copy) ? f.push(T) : u && R.push(this.getTitle(w, T));
			for (u && o.push(R.slice()), m = t; m <= e; m++) {
				var S = l[m],
					k = {},
					E = {},
					F = {
						rowIndx: m,
						rowIndxPage: m - D,
						rowData: S,
						Export: !0,
						exportClip: !0
					};
				if (!1 === S.pq_copy) h.push(m);
				else {
					for (R = [], T = n; T <= i; T++) v = (w = r[T]).dataIndx, !1 !== _[T] && (p = S[v], d && ((g = C(S, w, I, m, T)) === p && (F.colIndx = T, F.column = w, F.dataIndx = v, g = b(F, c, M)[0], q[T] && /(\r|\n)/.test(g) && (g = this.newLine(g))), R.push(g)), s && void 0 !== p && (k[v] = void 0, E[v] = p));
					s && a.push({
						rowIndx: m,
						rowData: S,
						oldRow: E,
						newRow: k
					}), o.push(R.slice())
				}
			}
		},
		copy: function(t) {
			var e, n, i, r, o, a = this.that,
				l = (t = t || {}).dest,
				s = !!t.cut,
				d = null == t.copy || t.copy,
				c = t.source || (s ? "cut" : "copy"),
				u = t.history,
				h = t.allowInvalid,
				f = [],
				p = [],
				g = [],
				m = [],
				v = a.get_p_data(),
				w = a.colModel,
				x = t.render,
				y = t.header,
				C = a.options.copyModel,
				b = (navigator || {}).clipboard,
				I = this.address(),
				q = {
					areas: I,
					cut: s,
					dest: l,
					header: y
				},
				u = null == u || u,
				h = null == h || h,
				x = null == x ? C.render : x,
				y = null == y ? C.header : y;
			if (I.length && !1 !== a._trigger("beforeCopy", null, q)) return I.forEach(function(t) {
				r = t.type, e = t.r1, n = t.c1, i = "cell" === r ? e : t.r2, r = "cell" === r ? n : t.c2, this._copyArea(e, i, n, r, w, p, f, v, s, d, x, y, g, m)
			}, this), d && (C = t.clip, o = p.map(function(t) {
				return t.join("\t") || " "
			}).join("\n"), C ? (C.val(o), C.select()) : (b && b.writeText(o), a._setGlobalStr(o)), q.data = p, q.skippedRIs = g, q.skippedCIs = m, a._trigger("copy", null, q)), l ? a.paste({
				text: o,
				dest: l,
				rowList: f,
				history: u,
				allowInvalid: h
			}) : s && !1 !== a._digestData({
				updateList: f,
				source: c,
				history: u,
				allowInvalid: h
			}) && a.refresh({
				source: c,
				header: !1
			}), o
		},
		_countArea: function(t) {
			var e = t.type,
				n = t.r1,
				i = t.c1,
				r = t.r2,
				t = t.c2;
			return "cell" === e ? 1 : (r - n + 1) * (t - i + 1)
		},
		count: function() {
			for (var t = "range" === this._type, e = this.address(), n = 0, i = e.length, r = 0; r < i; r++) n += t ? this._countArea(e[r]) : 1;
			return n
		},
		cut: function(t) {
			return (t = t || {}).cut = !0, this.copy(t)
		},
		_eachRC: function(i, r, o, a, l) {
			var s = this.that,
				d = {
					r1: "getFirstVisibleRIP",
					c1: "getFirstVisibleCI"
				},
				c = {
					r1: "getLastVisibleRIP",
					c1: "getLastVisibleCI"
				};
			this.address().forEach(function(t) {
				var e = t[o],
					n = t[a];
				for (n == e && l && (s[d[o]]() == e && (e = 0), s[c[o]]() == n && (n = r.length - 1)); e <= n; e++) i(r[e], e)
			})
		},
		eachCol: function(t, e) {
			this._eachRC(t, this.that.colModel, "c1", "c2", e)
		},
		eachRow: function(t, e) {
			this._eachRC(t, this.that.pdata, "r1", "r2", e)
		},
		_hsCols: function(t, e) {
			var n = [],
				i = {};
			this.eachCol(function(t) {
				n.push(t.dataIndx)
			}, e), i[t] = n, this.that.Columns().hide(i)
		},
		hideCols: function() {
			this._hsCols("diHide")
		},
		showCols: function() {
			this._hsCols("diShow", !0)
		},
		hideRows: function(e, t) {
			this.eachRow(function(t) {
				t.pq_hidden = !e
			}, t), this.that.refreshView()
		},
		showRows: function() {
			this.hideRows(!0, !0)
		},
		each: function(t, e) {
			for (var n = this.that, i = n.colModel, r = this.address(), o = 0, a = n.pdata; o < r.length; o++)
				for (var l, s, d, c, u = r[o], h = u.r1, f = u.r2, p = u.c2, g = u.type, m = "column" == g, v = "row" == g, w = h; w <= f; w++) {
					if (l = a[w])
						for (s = (s = d = u.c1) < 0 ? 0 : s; s <= p; s++) {
							if ((c = i[s]) && !1 === t(l, c.dataIndx, c, g, w, s, h, d, f, p)) return;
							if (v && !e) break
						}
					if (m && !e) break
				}
		},
		enable: function(t) {
			return null == (t = this.prop("edit", t)) || t
		},
		getAPS: function(i, r) {
			var o, a, l, s, d = this;
			return d.each(function(t, e, n) {
				return d.addProp(n), l = ((t["pq_cell" + r] || {})[e] || {})[i], s = (t["pq_row" + r] || {})[i], o = (n[r] || {})[i], a = null == l ? null == s ? o : s : l, !1
			}), a
		},
		getAttr: function(t) {
			return this.getAPS(t, "attr")
		},
		getProp: function(t) {
			return this.getAPS(t, "prop")
		},
		getStyle: function(t) {
			return this.getAPS(t, "style")
		},
		getIndx: function(t) {
			return null == t ? this._areas.length - 1 : t
		},
		getValue: function() {
			var t, e, n, i, r, o, a, l, s, d = this.address(),
				c = [],
				u = this.that;
			if (d.length) {
				for (n = (d = d[0]).r1, i = d.c1, r = d.r2, o = d.c2, s = u.get_p_data(), a = n; a <= r; a++)
					for (t = s[a], l = i; l <= o; l++) e = t[u.colModel[l].dataIndx], c.push(e);
				return c
			}
		},
		indexOf: function(t) {
			for (var e, n = (t = this._normal(t)).r1, i = t.c1, r = t.r2, o = t.c2, a = this.address(), l = 0, s = a.length; l < s; l++)
				if (n >= (e = a[l]).r1 && r <= e.r2 && i >= e.c1 && o <= e.c2) return l;
			return -1
		},
		index: function(t) {
			for (var e, n = (t = this._normal(t)).type, i = t.r1, r = t.c1, o = t.r2, a = t.c2, l = this.address(), s = 0, d = l.length; s < d; s++)
				if (n === (e = l[s]).type && i === e.r1 && o === e.r2 && r === e.c1 && a === e.c2) return s;
			return -1
		},
		init: function(t, e) {
			var n, i;
			if (e = !1 !== e, t)
				if (pq.isFn(t.push))
					for (var r = 0, o = t.length; r < o; r++) this.init(t[r], e);
				else pq.isStr(t) ? this.init(pq.getAddress(t), e) : (n = this._normal(t, e), i = this._areas = this._areas || [], n && i.push(n))
		},
		isValid: function() {
			return !!this._areas.length
		},
		freezePanes: function() {
			var t, e, n, i = this._areas[0];
			if (i) return t = i.c1, i = i.r1, (n = (e = this.that).options).freezeRows = i, n.freezeCols = t, e.refresh(), !0
		},
		format: function(t) {
			return this.prop("format", t)
		},
		addCol: function(t, e) {
			for (var n = this._areas[0], i = n.c1, r = n.c2, o = [], a = i; a <= r; a++) o.push(v.extend({
				dataIndx: Math.random(),
				width: 100
			}, e));
			this.that.Columns().add(o, t ? r + 1 : i, null, "addCols")
		},
		deleteCol: function() {
			var t = this._areas[0],
				e = t.c1,
				t = t.c2;
			this.that.Columns().remove(t - e + 1, e)
		},
		addRow: function(t, e) {
			for (var n = this._areas[0], i = n.r1, r = n.r2, o = [], a = i; a <= r; a++) o.push(v.extend({}, e));
			this.that.addNodes(o, t ? r + 1 : i, null, "addRows")
		},
		deleteRow: function() {
			var t = this._areas[0],
				e = this.that,
				n = t.r1,
				n = e.pageData().slice(n, t.r2 + 1);
			e.deleteNodes(n)
		},
		merge: function(t) {
			t = t || {};
			var e, n, i = this.that,
				r = i.options.mergeCells,
				o = this._areas[0];
			o && (e = o.r2 - o.r1 + 1, n = o.c2 - o.c1 + 1, (1 < e || 1 < n) && (o.rc = e, o.cc = n, r.push(o), !1 !== t.refresh && i.refreshView()))
		},
		newLine: function(t) {
			return '"' + t.replace(/"/g, '""') + '"'
		},
		replace: function(t, e) {
			var t = this._normal(t),
				n = this._areas,
				e = this.getIndx(e);
			n.splice(e, 1, t)
		},
		remove: function(t) {
			var e = this._areas,
				t = this.indexOf(t);
			0 <= t && e.splice(t, 1)
		},
		resize: function(t, e) {
			var n = this._normal(t),
				i = this._areas[this.getIndx(e)];
			return ["r1", "c1", "r2", "c2", "rc", "cc", "type"].forEach(function(t) {
				i[t] = n[t]
			}), this
		},
		rows: function(t) {
			var e = this.that,
				n = [],
				i = this.addressLast();
			if (i)
				for (var r = i.r1, o = i.c1, a = i.r2, l = i.c2, s = i.type, d = null == t ? a : r + t, c = null == t ? r : r + t; c <= d; c++) n.push({
					r1: c,
					c1: o,
					r2: c,
					c2: l,
					type: s
				});
			return pq.Range(e, n, "row")
		},
		_normal: function(t, e) {
			if (t.type) return t;
			if (pq.isFn(t.push)) {
				for (var n = [], i = 0, r = t.length; i < r; i++) {
					var o = this._normal(t[i], e);
					o && n.push(o)
				}
				return n
			}
			var a, l, s = this.that,
				d = s.get_p_data().length - 1,
				c = s.colModel.length - 1,
				u = d < (u = t.r1) ? d : u,
				h = c < (h = t.c1) ? c : h,
				f = t.rc,
				p = t.cc,
				g = t.r2,
				m = t.c2;
			return c < 0 || d < 0 ? null : null != u || null != h ? (g < u && (a = u, u = g, g = a), m < h && (a = h, h = m, m = a), null == u ? (u = 0, g = d, m = null == m ? h : m, l = "column") : null == h ? (t._type, h = 0, g = null == g ? u : g, m = c, l = t._type || "row") : null == g && null == f || u == g && h == m ? (l = "cell", g = u, m = h) : l = "block", g = d < (g = f ? u + f - 1 : g) ? d : g, m = c < (m = p ? h + p - 1 : m) ? c : m, !e || "block" != l && "cell" != l || (u = (n = s.iMerge.inflateRange(u, h, g, m))[0], h = n[1], g = n[2], m = n[3]), f = g - u + 1, p = m - h + 1, t.r1 = u, t.c1 = h, t.r2 = g, t.c2 = m, t.rc = f, t.cc = p, t.type = t.type || l, t) : void 0
		},
		select: function() {
			var e = this.that.iSelection,
				t = this._areas;
			return t.length && (e.removeAll({
				trigger: !1
			}), t.forEach(function(t) {
				e.add(t, !1)
			}), e.trigger()), this
		},
		style: function(t, e, n) {
			return this.metaVal = n, this._prop(t, e, "Style")
		},
		_prop: function(t, e, n) {
			return this[(null != e ? "set" : "get") + n](t, e)
		},
		attr: function(t, e) {
			return this._prop(t, e, "Attr")
		},
		prop: function(t, e) {
			return this._prop(t, e, "Prop")
		},
		toggleStyle: function(t, e) {
			var n = this.getStyle(t),
				n = n && n != e[1] ? e[1] : e[0];
			this.style(t, n)
		},
		unmerge: function(t) {
			t = t || {};
			var e = this.that,
				n = e.options.mergeCells,
				i = this._areas[0];
			if (i) {
				for (var r = 0; r < n.length; r++) {
					var o = n[r];
					if (o.r1 === i.r1 && o.c1 === i.c1) {
						n.splice(r, 1);
						break
					}
				}!1 !== t.refresh && e.refreshView()
			}
		},
		align: function(t) {
			return this.prop("align", t)
		},
		valign: function(t) {
			return this.prop("valign", t)
		},
		value: function(t) {
			var e = 0,
				n = this.that,
				i = n.colModel,
				r = [],
				o = this.address();
			if (void 0 === t) return this.getValue();
			for (var a = 0; a < o.length; a++)
				for (var l, s = (l = o[a]).r1, d = l.c1, c = l.r2, u = l.c2, h = s; h <= c; h++) {
					for (var f = n.normalize({
							rowIndx: h
						}), p = f.rowData, f = f.rowIndx, g = {}, m = {}, v = d; v <= u; v++) {
						var w = i[v].dataIndx;
						m[w] = t[e++], g[w] = p[w]
					}
					r.push({
						rowData: p,
						rowIndx: f,
						newRow: m,
						oldRow: g
					})
				}
			return r.length && (n._digestData({
				updateList: r,
				source: "range"
			}), n.refresh({
				header: !1
			})), this
		},
		val2D: function() {
			var t, e = [],
				o = this.that,
				a = {};
			for (t in this._areas.forEach(function(t) {
					for (var e, n = t.c1, i = t.c2, r = t.r1; r <= t.r2; r++) e = o.Range({
						r1: r,
						rc: 1,
						c1: n,
						c2: i
					}).value(), a[r] = a[r] ? a[r].concat(e) : e
				}), a) e.push(a[t]);
			return e
		}
	}, pq.mixin.render);
	var n = pq.Selection = function(t, e) {
		if (null == t) throw "invalid param";
		if (this instanceof n == 0) return new n(t, e);
		this._areas = [], this.that = t, this.iCells = new v.paramquery.cCells(t), this._base(t, e)
	};
	pq.inherit(r, n, {
		add: function(t, e) {
			var t = this._normal(t, !0),
				n = this.iCells;
			0 <= this.indexOf(t) || (n.addBlock(t), this._super(t), !1 !== e && this.trigger())
		},
		clearOther: function(t, e) {
			var n = this.iCells,
				i = this._normal(t, !0);
			this.address().forEach(function(t) {
				t.r1 == i.r1 && t.c1 == i.c1 && t.r2 == i.r2 && t.c2 == i.c2 || n.removeBlock(t)
			}), this._super(i), e || this.trigger()
		},
		getSelection: function() {
			return this.iCells.getSelection()
		},
		isSelected: function(t) {
			return this.iCells.isSelected(t)
		},
		removeAll: function(t) {
			t = t || {}, this._areas.length && (this.iCells.removeAll(), !(this._areas = []) !== t.trigger && this.trigger())
		},
		resizeOrReplace: function(t, e) {
			this.resize(t, e) || this.replace(t, e)
		},
		replace: function(t, e) {
			var n = this.iCells,
				t = this._normal(t),
				i = this._areas,
				e = this.getIndx(e),
				i = i[e];
			n.removeBlock(i), n.addBlock(t), this._super(t, e), this.trigger()
		},
		resize: function(t, e) {
			var t = this._normal(t, !0),
				n = t.r1,
				i = t.c1,
				r = t.r2,
				t = t.c2,
				o = this._areas || [];
			if (!o.length) return !1;
			var o = o[this.getIndx(e)],
				e = o.r1,
				a = o.c1,
				l = o.r2,
				o = o.c2;
			return e === n && a === i && (e === n && o === t) && (l === r && a === i) && (l === r && o === t) || void 0
		},
		selectAll: function(t) {
			var e = (t = t || {}).type,
				n = this.that,
				i = n.colModel,
				t = t.all,
				r = t ? 0 : n.riOffset,
				t = (t ? n.get_p_data() : n.pdata).length,
				i = i.length - 1,
				t = r + t - 1,
				e = "row" === e ? {
					r1: r,
					r2: t
				} : {
					c1: 0,
					c2: i,
					_type: "column",
					r1: 0,
					r2: t
				};
			return n.Range(e).select(), this
		},
		trigger: function() {
			var t = this.that;
			t._trigger("selectChange", null, {
				selection: this
			}), t.off("mousePQUp", e), t.off("keyUp", e), t.on("mousePQUp", e), t.on("keyUp", e)
		}
	})
}(jQuery), ! function(E) {
	var F = E.paramquery;
	E.widget("paramquery.pqToolbar", {
		options: {
			items: [],
			gridInstance: null,
			events: {
				button: "click",
				select: "change",
				checkbox: "change",
				textbox: "change",
				color: "change",
				textarea: "change",
				file: "change"
			}
		},
		_create: function() {
			var t, e = this.options,
				n = e.gridInstance,
				i = e.events,
				r = e.bootstrap.on,
				o = n.colModel,
				a = n.options.filterModel.timeout,
				l = e.items,
				s = this.element,
				d = 0,
				c = l.length;
			for (s.addClass("pq-toolbar"); d < c; d++) {
				var u, h, f, p, g = l[d],
					m = g.type,
					v = g.value,
					w = g.icon,
					x = g.options = g.options || {},
					y = g.label,
					C = g.init,
					b = ((u = g.listener) ? [u] : g.listeners) || [function() {}],
					I = g.cls,
					I = (I = I || "") ? "class='" + I + "'" : "",
					q = g.style,
					q = q ? "style='" + q + "'" : "",
					_ = g.styleCtrl ? "style='" + g.styleCtrl + "'" : "",
					R = g.attr || "",
					D = y ? "<label " + q + ">" + y : "",
					M = y ? "</label>" : "",
					_ = (_ = y && "button" != m && "file" != m ? [I, R, _] : [I, R, q || _]).join(" ");
				"textbox" == m || "color" == m ? f = E([D, "<input type=" + ("color" == m ? m : "text") + " " + _ + ">", M].join("")) : "textarea" == m ? f = E([D, "<textarea " + _ + "></textarea>", M].join("")) : "select" == m ? (pq.isFn(x) && (x = x.call(n, {
					colModel: o
				})), h = F.select({
					options: x = x || [],
					attr: _,
					prepend: g.prepend,
					groupIndx: g.groupIndx,
					valueIndx: g.valueIndx,
					labelIndx: g.labelIndx
				}), f = E([D, h, M].join(""))) : "file" == m ? f = E(["<label class='ui-button ui-widget ui-state-default ui-corner-all " + (I = w && y ? "ui-button-text-icon-primary" : w ? "ui-button-icon-only" : "ui-button-text-only") + "' " + R + " " + q + ">", "<input type='file' style='display:none;' " + (g.attrFile || "") + ">", w ? "<span class='ui-button-icon-primary ui-icon " + w + "'></span>" : "", "<span class='ui-button-text'>" + (y || "") + "</span>", "</label>"].join("")) : "checkbox" == m ? f = E([y ? "<label " + q + ">" : "", "<input type='checkbox' ", v ? "checked='checked' " : "", _, ">", y ? y + "</label>" : ""].join("")) : "separator" == m ? f = E("<span class='pq-separator' " + [R, q].join(" ") + "></span>") : "button" == m ? (f = E("<button type='button' " + _ + ">" + y + "</button>")).button(E.extend({
					label: y || "",
					showLabel: !!y,
					text: !!y,
					icon: w,
					icons: {
						primary: r ? "" : w
					}
				}, x)) : pq.isStr(m) ? f = E(m) : pq.isFn(m) && (h = m.call(n, {
					colModel: o,
					cls: I
				}), f = E(h)), f.appendTo(s), C && C.call(n, f[0]), p = this.getInner(f, y, m), "checkbox" !== m && void 0 !== v && p.val(v);
				for (var T = 0, S = b.length; T < S; T++) {
					var k = {};
					for (t in "function" == typeof(u = b[T]) ? k[i[m]] = u : k = u, k) pq.fakeEvent(p, t, a), p.on(t, this._onEvent(n, k[t], g))
				}
			}
		}
	}), E.extend(F.pqToolbar.prototype, {
		getInner: function(t, e, n) {
			return "LABEL" == t[0].nodeName.toUpperCase() ? E(t.children("input,select,textarea")) : t
		},
		refresh: function() {
			this.element.empty(), this._create()
		},
		_onEvent: function(n, i, r) {
			return function(t) {
				var e = r.type;
				r.value = "checkbox" == e ? E(t.target).prop("checked") : E(t.target).val(), i.call(n, t), "file" == e && E(this).val("")
			}
		},
		_destroy: function() {
			this.element.empty().removeClass("pq-toolbar").enableSelection()
		},
		_disable: function() {
			null == this.$disable && (this.$disable = E("<div class='pq-grid-disable'></div>").css("opacity", .2).appendTo(this.element))
		},
		_enable: function() {
			this.$disable && (this.element[0].removeChild(this.$disable[0]), this.$disable = null)
		},
		_setOption: function(t, e) {
			"disabled" == t && (1 == e ? this._disable() : this._enable())
		}
	}), pq.toolbar = function(t, e) {
		t = E(t).pqToolbar(e);
		return t.data("paramqueryPqToolbar") || t.data("paramquery-pqToolbar")
	}
}(jQuery), ! function(M) {
	var t = M.paramquery,
		e = t.pqGrid.prototype;
	e.options.trackModel = {
		on: !1,
		dirtyClass: "pq-cell-dirty"
	}, t.cUCData = function(t) {
		this.that = t, this.udata = [], this.ddata = [], this.adata = [], this.options = t.options, t.on("dataAvailable", this.onDA(this))
	}, t.cUCData.prototype = {
		add: function(t) {
			for (var e = this.that, n = this.adata, i = this.ddata, r = t.rowData, o = this.options.trackModel.dirtyClass, a = e.getRecId({
					rowData: r
				}), l = 0, s = n.length; l < s; l++) {
				var d = n[l];
				if (null != a && d.recId == a) throw "primary key violation";
				if (d.rowData == r) throw "same data can't be added twice."
			}
			for (l = 0, s = i.length; l < s; l++)
				if (r == i[l].rowData) return void i.splice(l, 1);
			var c, u = [];
			for (c in r) u.push(c);
			e.removeClass({
				rowData: r,
				dataIndx: u,
				cls: o
			});
			t = {
				recId: a,
				rowData: r
			};
			n.push(t)
		},
		commit: function(t) {
			var e, n, i, r, o = this.that;
			null == t ? (this.commitAddAll(), this.commitUpdateAll(), this.commitDeleteAll()) : (r = t.history, (n = o.options).treeModel, e = [], n = n.dataModel.recIndx, i = t.type, t = t.rows, r = null != r && r, "add" == i ? t ? e = this.commitAdd(t, n) : this.commitAddAll() : "update" == i ? t ? this.commitUpdate(t, n) : this.commitUpdateAll() : "delete" == i && (t ? this.commitDelete(t, n) : this.commitDeleteAll()), e.length && (o._digestData({
				source: "commit",
				checkEditable: !1,
				track: !1,
				history: r,
				updateList: e
			}), o.refreshView({
				header: !1
			})))
		},
		commitAdd: function(t, e) {
			for (var n, i, r, o, a = this.that, l = a.colModel, s = l.length, d = this.adata, c = M.inArray, u = a.options.treeModel, h = null != u.dataIndx, f = u.parentId, p = d.length, g = a.getValueFromDataType, m = [], v = t.length, w = [], x = 0; x < v; x++)
				for (r = t[x], D = 0; D < p; D++)
					if (o = !0, -1 == c(i = d[D].rowData, w)) {
						for (n = 0; n < s; n++) {
							var y = l[n],
								C = y.dataType,
								b = y.dataIndx;
							if (!(y.hidden || b == e || h && b == f))
								if (g(i[b], C) !== g(r[b], C)) {
									o = !1;
									break
								}
						}
						if (o) {
							function I(t) {
								q[t] = r[t], _[t] = i[t]
							}
							var q = {},
								_ = {};
							I(e), h && I(f), m.push({
								rowData: i,
								oldRow: _,
								newRow: q
							}), w.push(i);
							break
						}
					} for (var R = [], D = 0; D < p; D++) - 1 == c(i = d[D].rowData, w) && R.push(d[D]);
			return this.adata = R, m
		},
		commitDelete: function(t, e) {
			for (var n, i, r, o, a = this.ddata, l = a.length, s = this.udata; l-- && (i = (n = a[l].rowData)[e], r = t.length);)
				for (; r--;)
					if (i == t[r][e]) {
						for (t.splice(r, 1), a.splice(l, 1), o = s.length; o--;) s[o].rowData == n && s.splice(o, 1);
						break
					}
		},
		commitUpdate: function(t, e) {
			for (var n, i = this.that, r = this.options.trackModel.dirtyClass, o = this.udata, a = o.length, l = t.length, s = [], d = 0; d < a; d++) {
				var c = o[d],
					u = c.rowData,
					h = c.oldRow;
				if (-1 == M.inArray(u, s))
					for (n = 0; n < l; n++) {
						var f = t[n];
						if (u[e] == f[e])
							for (var p in s.push(u), h) i.removeClass({
								rowData: u,
								dataIndx: p,
								cls: r
							})
					}
			}
			var g = [];
			for (d = 0; d < a; d++) u = o[d].rowData, -1 == M.inArray(u, s) && g.push(o[d]);
			this.udata = g
		},
		commitAddAll: function() {
			this.adata = []
		},
		commitDeleteAll: function() {
			for (var t, e = this.ddata, n = this.udata, i = n.length, r = e.length, o = 0; 0 < i && o < r; o++) {
				for (t = e[o].rowData; i--;) n[i].rowData == t && n.splice(i, 1);
				i = n.length
			}
			e.length = 0
		},
		commitUpdateAll: function() {
			for (var t = this.that, e = this.options.trackModel.dirtyClass, n = this.udata, i = 0, r = n.length; i < r; i++) {
				var o, a = n[i],
					l = a.oldRow,
					s = a.rowData;
				for (o in l) t.removeClass({
					rowData: s,
					dataIndx: o,
					cls: e
				})
			}
			this.udata = []
		},
		delete: function(t) {
			for (var e = this.that, n = t.rowIndx, i = t.rowIndxPage, r = e.riOffset, n = null == n ? i + r : n, i = null == i ? n - r : i, r = "remote" == e.options.pageModel.type ? i : n, o = this.adata, i = this.ddata, a = e.getRowData(t), l = 0, s = o.length; l < s; l++)
				if (o[l].rowData == a) return void o.splice(l, 1);
			i.push({
				indx: r,
				rowData: a,
				rowIndx: n
			})
		},
		getChangesValue: function(t) {
			for (var e = this.that, n = (t = t || {}).all, i = this.udata, r = this.adata, o = this.ddata, a = [], l = [], s = [], d = [], c = [], u = [], h = 0, f = o.length; h < f; h++) {
				var p = (w = o[h]).rowData,
					g = {};
				for (v in c.push(p), p) 0 != v.indexOf("pq_") && (g[v] = p[v]);
				u.push(g)
			}
			for (h = 0, f = i.length; h < f; h++) {
				var m = (w = i[h]).oldRow,
					p = w.rowData;
				if (-1 == M.inArray(p, c) && -1 == M.inArray(p, a)) {
					g = {};
					if (!1 !== n)
						for (var v in p) 0 != v.indexOf("pq_") && (g[v] = p[v]);
					else {
						for (var v in m) g[v] = p[v];
						g[e.options.dataModel.recIndx] = w.recId
					}
					a.push(p), l.push(g), s.push(m)
				}
			}
			for (h = 0, f = r.length; h < f; h++) {
				var w, g = {};
				for (v in p = (w = r[h]).rowData) 0 != v.indexOf("pq_") && (g[v] = p[v]);
				d.push(g)
			}
			return {
				updateList: l,
				addList: d,
				deleteList: u,
				oldList: s
			}
		},
		getChanges: function() {
			this.that;
			for (var t = this.udata, e = this.adata, n = this.ddata, i = M.inArray, r = [], o = [], a = [], l = [], s = 0, d = n.length; s < d; s++) {
				var c = (h = n[s]).rowData;
				l.push(c)
			}
			for (s = 0, d = t.length; s < d; s++) {
				var u = (h = t[s]).oldRow; - 1 == i(c = h.rowData, l) && -1 == i(c, r) && (r.push(c), o.push(u))
			}
			for (s = 0, d = e.length; s < d; s++) {
				var h, c = (h = e[s]).rowData;
				a.push(c)
			}
			return {
				updateList: r,
				addList: a,
				deleteList: l,
				oldList: o
			}
		},
		getChangesRaw: function() {
			this.that;
			var t = this.udata,
				e = this.adata,
				n = this.ddata,
				i = {
					updateList: [],
					addList: [],
					deleteList: []
				};
			return i.updateList = t, i.addList = e, i.deleteList = n, i
		},
		isDirty: function(t) {
			var e = this.that,
				n = this.udata,
				i = this.adata,
				r = this.ddata,
				o = !1,
				a = e.getRowData(t);
			if (a) {
				for (var l = 0; l < n.length; l++)
					if (a == n[l].rowData) {
						o = !0;
						break
					}
			} else(n.length || i.length || r.length) && (o = !0);
			return o
		},
		onDA: function(n) {
			return function(t, e) {
				"filter" != e.source && (n.udata = [], n.ddata = [], n.adata = [])
			}
		},
		rollbackAdd: function(t, e) {
			for (var n = this.adata, i = [], r = (t.type, 0), o = n.length; r < o; r++) {
				var a = n[r].rowData;
				i.push({
					type: "delete",
					rowData: a
				})
			}
			return this.adata = [], i
		},
		rollbackDelete: function(t, e) {
			for (var n = this.ddata, i = [], r = (t.type, n.length - 1); 0 <= r; r--) {
				var o = n[r],
					a = (o.indx, o.rowIndx),
					o = o.rowData;
				i.push({
					type: "add",
					rowIndx: a,
					newRow: o
				})
			}
			return this.ddata = [], i
		},
		rollbackUpdate: function(t, e) {
			for (var n = this.that, i = this.options.trackModel.dirtyClass, r = this.udata, o = [], a = 0, l = r.length; a < l; a++) {
				var s = r[a],
					d = s.recId,
					c = s.rowData,
					u = {},
					s = s.oldRow;
				if (null != d) {
					var h, f = [];
					for (h in s) u[h] = c[h], f.push(h);
					n.removeClass({
						rowData: c,
						dataIndx: f,
						cls: i,
						refresh: !1
					}), o.push({
						type: "update",
						rowData: c,
						newRow: s,
						oldRow: u
					})
				}
			}
			return this.udata = [], o
		},
		rollback: function(t) {
			var e = this.that,
				n = e.options.dataModel,
				i = e.options.pageModel,
				r = !t || null == t.refresh || t.refresh,
				t = t && null != t.type ? t.type : null,
				o = [],
				a = [],
				l = [],
				n = n.data;
			null != t && "update" != t || (a = this.rollbackUpdate(i, n)), null != t && "delete" != t || (o = this.rollbackDelete(i, n)), null != t && "add" != t || (l = this.rollbackAdd(i, n)), e._digestData({
				history: !1,
				allowInvalid: !0,
				checkEditable: !1,
				source: "rollback",
				track: !1,
				addList: o,
				updateList: a,
				deleteList: l
			}), r && e.refreshView({
				header: !1
			})
		},
		update: function(t) {
			var e = this.that,
				n = this.options.trackModel.dirtyClass,
				i = t.rowData || e.getRowData(t),
				r = e.getRecId({
					rowData: i
				}),
				o = t.dataIndx,
				a = t.refresh,
				l = e.columns,
				s = e.getValueFromDataType,
				d = t.row,
				c = this.udata,
				u = c.slice(0),
				h = !1;
			if (null != r && 0 != (r + "").indexOf("pq_tmp_")) {
				for (var f = 0, p = c.length; f < p; f++) {
					var g = c[f],
						m = g.oldRow;
					if (g.rowData == i) {
						for (var o in h = !0, d) {
							var v = l[o].dataType,
								w = s(d[o], v),
								v = s(m[o], v);
							m.hasOwnProperty(o) && v === w ? (e.removeClass(x = {
								rowData: i,
								dataIndx: o,
								refresh: a,
								cls: n
							}), delete m[o]) : (e.addClass(x = {
								rowData: i,
								dataIndx: o,
								refresh: a,
								cls: n
							}), m.hasOwnProperty(o) || (m[o] = i[o]))
						}
						M.isEmptyObject(m) && u.splice(f, 1);
						break
					}
				}
				if (!h) {
					m = {};
					for (o in d) {
						m[o] = i[o];
						var x = {
							rowData: i,
							dataIndx: o,
							refresh: a,
							cls: n
						};
						e.addClass(x)
					}
					x = {
						rowData: i,
						recId: r,
						oldRow: m
					};
					u.push(x)
				}
				this.udata = u
			}
		}
	}, e.getChanges = function(t) {
		if (this.blurEditor({
				force: !0
			}), t) {
			var e = t.format;
			if (e) {
				if ("byVal" == e) return this.iUCData.getChangesValue(t);
				if ("raw" == e) return this.iUCData.getChangesRaw()
			}
		}
		return this.iUCData.getChanges()
	}, e.rollback = function(t) {
		this.blurEditor({
			force: !0
		}), this.iUCData.rollback(t)
	}, e.isDirty = function(t) {
		return this.iUCData.isDirty(t)
	}, e.commit = function(t) {
		this.iUCData.commit(t)
	}, e.updateRow = function(t) {
		var e = this,
			n = t.rowList || [{
				rowIndx: t.rowIndx,
				newRow: t.newRow || t.row,
				rowData: t.rowData,
				rowIndxPage: t.rowIndxPage
			}],
			o = [];
		if (e.normalizeList(n).forEach(function(t) {
				var e, n = t.newRow,
					i = t.rowData,
					r = t.oldRow = {};
				if (i) {
					for (e in n) r[e] = i[e];
					o.push(t)
				}
			}), o.length) {
			n = {
				source: t.source || "update",
				history: t.history,
				checkEditable: t.checkEditable,
				track: t.track,
				allowInvalid: t.allowInvalid,
				updateList: o
			}, t = e._digestData(n);
			if (!1 === t) return !1;
			M.isArray(t) && t.forEach(function(t) {
				e.refreshCell({
					rowIndx: t[0],
					colIndx: t[1],
					skip: !0
				})
			})
		}
	}, e.getRecId = function(t) {
		var e = this.options.dataModel,
			e = (t.dataIndx = e.recIndx, this.getCellData(t));
		return null == e ? null : e
	}, e.getCellData = function(t) {
		var e = t.rowData || this.getRowData(t),
			t = t.dataIndx;
		return e ? e[t] : null
	}, e.getRowData = function(t) {
		if (!t) return null;
		var e, n = t.rowData;
		if (null != n) return n;
		if (null == (e = t.recId)) return n = null != (n = t.rowIndx) ? n : t.rowIndxPage + this.riOffset, this.get_p_data()[n];
		for (var i, t = this.options.dataModel, r = t.recIndx, o = t.data, a = 0, l = o.length; a < l; a++)
			if ((i = o[a])[r] == e) return i;
		return null
	}, e.addNodes = function(t, e) {
		e = null == e ? this.options.dataModel.data.length : e, this._digestData({
			addList: t.map(function(t) {
				return {
					rowIndx: e++,
					newRow: t
				}
			}),
			source: "addNodes"
		}), this.refreshView()
	}, e.deleteNodes = function(t) {
		this._digestData({
			deleteList: t.map(function(t) {
				return {
					rowData: t
				}
			}),
			source: "deleteNodes"
		}), this.refreshView()
	}, e.moveNodes = function(t, e) {
		var n = this.options,
			i = this.riOffset,
			r = n.dataModel.data;
		e = null == e ? r.length : e, this._trigger("beforeMoveNode"), t.forEach(function(t) {
			e = pq.moveItem(t, r, r.indexOf(t), e)
		}), r != this.pdata && (this.pdata = r.slice(i, n.pageModel.rPP + i)), this.iRefresh.addRowIndx(), this.iMerge.init(), this._trigger("moveNode", null, {
			args: arguments
		}), this.refresh()
	}, e.deleteRow = function(t) {
		var e = this.normalizeList(t.rowList || [{
			rowIndx: t.rowIndx,
			rowIndxPage: t.rowIndxPage,
			rowData: t.rowData
		}]);
		if (!e.length) return !1;
		this._digestData({
			source: t.source || "delete",
			history: t.history,
			track: t.track,
			deleteList: e
		}), !1 !== t.refresh && this.refreshView({
			header: !1
		})
	}, e.addRow = function(t) {
		var e = this.riOffset,
			n = this.options.dataModel,
			n = n.data = n.data || [];
		return t.rowData && (t.newRow = t.rowData), null != t.rowIndxPage && (t.rowIndx = t.rowIndxPage + e), !(!(e = t.rowList || [{
			rowIndx: t.rowIndx,
			newRow: t.newRow
		}]).length || !1 === this._digestData({
			source: t.source || "add",
			history: t.history,
			track: t.track,
			checkEditable: t.checkEditable,
			addList: e
		})) && (!1 !== t.refresh && this.refreshView({
			header: !1
		}), null == (t = e[0].rowIndx) ? n.length - 1 : t)
	}
}(jQuery), window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function(t) {
	return setTimeout(t, 10)
}, window.cancelAnimationFrame = window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || function(t) {
	clearTimeout(t)
}, ! function(u) {
	var t = u.paramquery;

	function e(t) {
		(this.that = t).on("cellClick", this.onCellClick.bind(this)).on("cellMouseDown", this.onCellMouseDown.bind(this)).on("cellMouseEnter", this.onCellMouseEnter.bind(this))
	}(t.cMouseSelection = e).prototype = u.extend({
		onCellMouseDown: function(t, e) {
			if (!t.isDefaultPrevented()) {
				var n = this.that,
					i = e.rowIndx,
					r = n.iSelection,
					o = e.colIndx,
					a = n.options.selectionModel,
					l = a.type,
					s = a.mode,
					d = !t.which || 1 == t.which,
					c = r.addressLast();
				if (!u(t.originalEvent.target).is("textarea,select,input:not([type='checkbox'])")) {
					if ("cell" == l) {
						if (null == o) return;
						if (-1 == o) {
							if (!a.row) return;
							o = void 0
						}
						t.shiftKey && "single" !== s && c ? (l = c.firstR, c = c.firstC, this.mousedown = {
							r1: l,
							c1: c
						}, r.resizeOrReplace({
							r1: l,
							c1: null == o ? void 0 : c,
							r2: i,
							c2: o,
							firstR: l,
							firstC: c
						})) : pq.isCtrl(t) && "single" !== s ? (this.mousedown = {
							r1: i,
							c1: o
						}, null == o ? r.add({
							r1: i,
							firstR: i,
							firstC: n.getFirstVisibleCI()
						}) : r.add({
							r1: i,
							c1: o,
							firstR: i,
							firstC: o
						})) : d && (this.mousedown = {
							r1: i,
							c1: o
						}, r.clearOther({
							r1: i,
							c1: o
						}, !0), null == o ? r.resizeOrReplace({
							r1: i,
							firstR: i,
							firstC: n.getFirstVisibleCI()
						}) : r.resizeOrReplace({
							r1: i,
							c1: o,
							firstR: i,
							firstC: o
						}))
					}
					d && n.focus(e), a.native || "ontouchend" in document || t.preventDefault(), n.one("mousePQUp", this.onMousePQUp.bind(this))
				}
			}
		},
		onCellMouseEnter: function(t, e) {
			var n, i, r = this.that,
				o = r.options.selectionModel,
				a = o.type,
				l = this.mousedown,
				o = o.mode;
			l && "single" !== o && ("cell" === a && (o = l.r1, a = l.c1, l = e.rowIndx, n = e.colIndx, i = r.Selection(), r.scrollCell({
				rowIndx: l,
				colIndx: n
			}), i.resizeOrReplace({
				r1: o,
				c1: a,
				r2: l,
				c2: n,
				firstR: o,
				firstC: a
			})), e.nofocus = !0, r.focusT(e))
		},
		onCellClick: function(t, e) {
			var n = this.that,
				i = n.options.selectionModel,
				r = "single" == i.mode,
				o = i.toggle,
				n = n.iRows;
			"row" != i.type || !i.row && -1 == e.colIndx || ((i = n.isSelected(e)) && !o ? pq.isCtrl(t) && (e.isFirst = !0, n.toggle(e)) : !r && t.shiftKey ? n.extend(e) : !r || i && o ? (e.isFirst = !0, n[o ? "toggle" : "replace"](e)) : i || n.replace(e))
		},
		onMousePQUp: function() {
			this.mousedown = null
		}
	}, new t.cClass)
}(jQuery), ! function(B) {
	var l = null,
		s = !1,
		t = B.paramquery,
		e = t.pqGrid.prototype,
		j = (B.extend(e.options, {
			copyModel: {
				on: !0,
				render: !1,
				zIndex: 1e4
			},
			cutModel: {
				on: !0
			},
			pasteModel: {
				on: !0,
				compare: "byVal",
				select: !0,
				validate: !0,
				allowInvalid: !0,
				type: "replace"
			}
		}), B.extend(e, {
			_setGlobalStr: function(t) {
				j.clip = t
			},
			canPaste: function() {
				return !!t.cExcel.clip
			},
			clearPaste: function() {
				t.cExcel.clip = ""
			},
			copy: function(t) {
				var e = this.iSelection;
				if (e.address().length) return e.copy(t);
				this.iRows.toRange().copy(t)
			},
			cut: function(t) {
				return this.iSelection.cut(t)
			},
			paste: function(e) {
				e = e || {};

				function n() {
					l.paste(e), l = null
				}
				var t = (navigator || {}).clipboard;
				l = new j(this), null == e.text && t && t.readText ? t.readText().then(function(t) {
					e.text = t, n()
				}).catch(function(t) {
					n()
				}) : n()
			},
			clear: function() {
				var t = this.iSelection;
				(t.address().length ? t : this.iRows.toRange()).clear()
			}
		}), t.cExcel = function(t) {
			this.that = t
		});
	j.clip = "", j.prototype = {
		initClip: function(t, e) {
			var n, i = this.that;
			return this.$oldAE = t, n = t.val(), i.iKeyNav.ignoreBlur(function() {
				t.replaceWith("<textarea></textarea>"), (t = e.children()).val(n), t.focus()
			}), t
		},
		destroyClip: function(t) {
			var e = this,
				n = e.$oldAE;
			t.parent().is(".pq-focus-mgr") && e.that.iKeyNav.ignoreBlur(function() {
				t.replaceWith(n), n.focus(), e.$oldAE = null
			})
		},
		getRows: function(t) {
			return (t = (t = t.replace(/\n$/, "")).replace(/(^|\t|\n)"(?=[^\t]*?[\r\n])([^"]|"")*"(?=$|\t|\n)/g, function(t) {
				return t.replace(/(?!^(\r\n|\n))(\r\n|\n)/g, "\r").replace(/^(\t|\n)?"/, "$1").replace(/"$/, "").replace(/""/g, '"')
			})).split("\n")
		},
		paste: function(t) {
			var e = this.that,
				n = (t = t || {}).dest,
				i = t.clip,
				t = t.text || (i ? i.length ? i.val() : "" : j.clip),
				r = this.getRows(t),
				o = r.length,
				a = e.colModel,
				l = e.options,
				$ = e.readCell,
				l = l.pasteModel,
				s = "row",
				d = !1,
				c = a.length,
				u = 0;
			if (i && i.val(""), l.on && 0 != t.length && 0 != o) {
				for (; u < o; u++) r[u] = r[u].split("\t");
				var h, f, p, g, m, v, w = e.$cont.hasClass("pq-focus") ? "append" : l.type,
					i = (n ? e.Range(n) : e.Selection()).address(),
					t = (i.length ? i : e.iRows.toRange().address())[0],
					n = {
						rows: r,
						areas: [t]
					};
				if (!1 === e._trigger("beforePaste", null, n)) return !1;
				g = t && e.getRowData({
					rowIndx: t.r1
				}) ? (s = "row" == t.type ? "row" : "cell", h = t.r1, p = t.r2, f = t.c1, t.c2) : (s = "cell", h = 0, p = e.pageData().length - 1, f = 0), "replace" == w ? v = p - (m = h) + 1 < o ? "extend" : "repeat" : "append" == w ? (m = p + 1, v = "extend") : "prepend" == w && (m = h, v = "extend");
				for (var x, y, C = "extend" == v ? o : p - h + 1, b = 0, I = 0, q = [], _ = [], H = 0, u = 0; u < C; u++) {
					var R = r[b],
						D = u + m,
						M = "replace" == w ? e.getRowData({
							rowIndx: D
						}) : null,
						T = M ? {} : null,
						S = {};
					if (void 0 === R && "repeat" === v && (R = r[b = 0]), M && !1 === M.pq_paste) C++, I++;
					else {
						b++;
						var O = R,
							k = O.length;
						if (!y)
							if ("cell" == s) {
								if (y = "extend" == (x = g - f + 1 < k ? "extend" : "repeat") ? k : g - f + 1, isNaN(y)) throw "lenH NaN. assert failed.";
								c < y + f && (y = c - f)
							} else y = c, f = 0;
						for (var E = 0, F = 0, V = 0, P = y, F = 0; F < P; F++) {
							k <= E && (E = 0);
							var A = a[F + f],
								N = O[E],
								L = A.dataIndx;
							!1 === A.paste ? (V++, "extend" == x && P + f < c && P++) : (E++, S[L] = N, T && (T[L] = $(M, A)))
						}
						0 == B.isEmptyObject(S) && (null == M ? (d = !0, q.push({
							newRow: S,
							rowIndx: D
						})) : _.push({
							newRow: S,
							rowIndx: D,
							rowData: M,
							oldRow: T
						}), H++)
					}
				}
				i = {
					addList: q,
					updateList: _,
					source: "paste",
					allowInvalid: l.allowInvalid,
					validate: l.validate
				};
				e._digestData(i), e[d ? "refreshView" : "refresh"]({
					header: !1
				}), l.select && e.Range({
					r1: m,
					c1: f,
					r2: m + H - 1 + I,
					c2: "extend" == x ? f + y - 1 + V : g
				}).select(), e._trigger("paste", null, n)
			}
		}
	}, B(document).off(".pqExcel").on("keydown.pqExcel", function(t) {
		var e = B(document.activeElement),
			n = e.parent(),
			i = n.is(".pq-focus-mgr:not(.pq-editor-outer)"),
			r = i && !n.hasClass("pq-focus-mgr-head"),
			o = t.keyCode,
			a = B.ui.keyCode;
		if (!i || o != a.UP && o != a.DOWN || t.preventDefault(), pq.isCtrl(t) && r) {
			i = e.closest(".pq-grid"), a = i.pqGrid("instance");
			if (l || e.length && i.length) {
				if (!l) try {
					if (a.options.selectionModel.native) return !0;
					l = new j(a)
				} catch (t) {
					return !0
				}
				e = l.initClip(e, n), "67" == o || "99" == o ? a.copy({
					clip: e
				}) : "88" == o ? a.copy({
					cut: !0,
					clip: e
				}) : "86" != o && "118" != o || s || (s = !0, window.setTimeout(function() {
					l && l.paste({
						clip: e
					}), s = !1
				}, 3))
			}
		}
	}).on("keyup.pqExcel", function(t) {
		var e = B(t.target);

		function n() {
			l.destroyClip(e), l = null
		}!pq.isCtrl(t) && l && (s ? l.that.one("paste", function() {
			n()
		}) : n())
	}).on("click.pqExcel keydown.pqExcel", function(t) {
		"click" != t.type && B.ui.keyCode.ENTER != t.keyCode || B(t.target).trigger("pq:clickE")
	})
}(jQuery), ! function(a) {
	var t = a.paramquery,
		e = t.pqGrid.prototype.options;
	e.historyModel = e.historyModel || {
		on: !0,
		checkEditable: !0,
		checkEditableAdd: !1,
		allowInvalid: !0
	};
	(t.cHistory = function(t) {
		var n = this;
		n.that = t, n.options = t.options, n.records = [], n.counter = 0, n.id = 0, t.on("keyDown", n.onKeyDown.bind(n)).on("dataAvailable", function(t, e) {
			"filter" != e.source && n.reset()
		})
	}).prototype = {
		onKeyDown: function(t, e) {
			var n = "90",
				i = "89",
				r = pq.isCtrl(t);
			return r && t.keyCode == n ? (this.undo(), !1) : r && t.keyCode == i ? (this.redo(), !1) : void 0
		},
		resetUndo: function() {
			if (0 == this.counter) return !1;
			this.counter = 0, this.that._trigger("history", null, {
				type: "resetUndo",
				num_undo: 0,
				num_redo: this.records.length - this.counter,
				canUndo: !1,
				canRedo: !0
			})
		},
		reset: function() {
			if (0 == this.counter && 0 == this.records.length) return !1;
			this.records = [], this.counter = 0, this.id = 0, this.that._trigger("history", null, {
				num_undo: 0,
				num_redo: 0,
				type: "reset",
				canUndo: !1,
				canRedo: !1
			})
		},
		increment: function() {
			var t = this.records,
				e = t.length;
			e ? (t = t[e - 1].id, this.id = t + 1) : this.id = 0
		},
		push: function(t) {
			var e, n, i = this.canRedo(),
				r = this.records,
				o = this.counter,
				o = (r.length > o && r.splice(o, r.length - o), r[o] = a.extend({
					id: this.id
				}, t), this.counter++, this.that);
			1 == this.counter && (e = !0), i && this.counter == r.length && (n = !1), o._trigger("history", null, {
				type: "add",
				canUndo: e,
				canRedo: n,
				num_undo: this.counter,
				num_redo: 0
			})
		},
		canUndo: function() {
			return 0 < this.counter
		},
		canRedo: function() {
			return this.counter < this.records.length
		},
		undo: function() {
			var t = this.canRedo(),
				e = this.that,
				n = this.options.historyModel,
				i = this.records;
			if (!(0 < this.counter)) return !1;
			this.counter--;
			var r, o, a, i = i[this.counter],
				l = i.callback;
			i.id;
			return l ? l() : (l = i.updateList.map(function(t) {
				return {
					rowIndx: e.getRowIndx({
						rowData: t.rowData
					}).rowIndx,
					rowData: t.rowData,
					oldRow: t.newRow,
					newRow: t.oldRow
				}
			}), a = i.addList.map(function(t) {
				return {
					rowData: t.newRow
				}
			}), i = i.deleteList.map(function(t) {
				return {
					newRow: t.rowData,
					rowIndx: t.rowIndx
				}
			}), e._digestData({
				history: !1,
				source: "undo",
				checkEditable: n.checkEditable,
				checkEditableAdd: n.checkEditableAdd,
				allowInvalid: n.allowInvalid,
				addList: i,
				updateList: l,
				deleteList: a
			}), e[i.length || a.length ? "refreshView" : "refresh"]({
				source: "undo",
				header: !1
			})), 0 == this.counter && (o = !1), e._trigger("history", null, {
				canUndo: o,
				canRedo: r = !1 === t ? !0 : r,
				type: "undo",
				num_undo: this.counter,
				num_redo: this.records.length - this.counter
			}), !0
		},
		redo: function() {
			var t = this.canUndo(),
				e = this.that,
				n = this.options.historyModel,
				i = this.counter,
				r = this.records;
			if (i == r.length) return !1;
			var o, a, l, i = r[i],
				s = i.callback;
			i.id;
			return s ? s(!0) : (s = i.updateList.map(function(t) {
				return {
					rowIndx: e.getRowIndx({
						rowData: t.rowData
					}).rowIndx,
					rowData: t.rowData,
					newRow: t.newRow,
					oldRow: t.oldRow
				}
			}), o = i.deleteList.map(function(t) {
				return {
					rowData: t.rowData
				}
			}), i = i.addList.map(function(t) {
				return {
					newRow: t.newRow,
					rowIndx: t.rowIndx
				}
			}), e._digestData({
				history: !1,
				source: "redo",
				checkEditable: n.checkEditable,
				checkEditableAdd: n.checkEditableAdd,
				allowInvalid: n.allowInvalid,
				addList: i,
				updateList: s,
				deleteList: o
			}), e[i.length || o.length ? "refreshView" : "refresh"]({
				source: "redo",
				header: !1
			})), this.counter < r.length && this.counter++, this.counter == this.records.length && (l = !1), e._trigger("history", null, {
				canUndo: a = 0 == t ? !0 : a,
				canRedo: l,
				type: "redo",
				num_undo: this.counter,
				num_redo: this.records.length - this.counter
			}), !0
		}
	};
	e = t.pqGrid.prototype;
	e.history = function(t) {
		var e = t.method;
		return this.iHistory[e](t)
	}, e.History = function() {
		return this.iHistory
	}
}(jQuery), ! function(c) {
	function m(t) {
		(this.that = t).on("load", this.onLoad.bind(this)).on("filter clearFilter", this.onFilterChange.bind(this))
	}
	var y = c.paramquery,
		t = (pq.filter = {
			dpBeforeShow: function(i, r, o) {
				return function() {
					var t, e, n = i.getDataCascade(r);
					n.length && (t = ("" == n[0][r] ? n[1] : n[0])[r], e = n[n.length - 1][r]), c(this).datepicker("option", "defaultDate", new Date(1 == o ? e : t))
				}
			},
			datepicker: function(t) {
				var e = t.column,
					i = e.dataIndx,
					r = this,
					o = t.filterUI,
					t = t.$editor,
					n = e.dataType,
					a = {
						dateFormat: o.format || e.format,
						changeYear: !0,
						changeMonth: !0
					};
				if ("date" == n) return t.each(function(t, e) {
					var n = c.extend({}, a, 1 == t && o.dpOptions2 || o.dpOptions);
					n.defaultDate || (n.beforeShow = n.beforeShow || pq.filter.dpBeforeShow(r, i, t)), c(e).datepicker(n)
				}), !0
			},
			filterFnEq: function(t, e) {
				var n = (t.column || {}).dataType;
				return "date" == n ? this.filterFnTD(t, e) : "bool" == n ? {
					type: "checkbox"
				} : c.extend({
					maxCheck: 1
				}, this.filterFnSelect(t, e))
			},
			filterFnSelect: function(t, e) {
				var n = t.column.dataIndx,
					t = t.indx;
				return {
					type: "select",
					style: "padding-" + (e && e.options.rtl ? "left" : "right") + ":16px;cursor:default;",
					attr: "readonly",
					valueIndx: n,
					labelIndx: n,
					options: this.options,
					init: 0 == t ? this.rangeInit.bind(e) : function() {}
				}
			},
			filterFnT: function() {
				return {
					type: "textbox",
					attr: "autocomplete='off'"
				}
			},
			filterFnTD: function() {
				return {
					type: "textbox",
					attr: "autocomplete='off'",
					init: pq.filter.datepicker
				}
			},
			getVal: function(t) {
				t = (t.crules || [])[0] || {};
				return [t.value, t.value2, t.condition]
			},
			setVal: function(t, e) {
				t = t.crules = t.crules || [];
				return t[0] = t[0] || {}, t[0].value = e
			}
		}, c.extend(pq.filter, {
			conditions: {
				begin: {
					string: 1,
					numberList: 1,
					dateList: 1,
					filterFn: pq.filter.filterFnT
				},
				between: {
					stringList: 1,
					date: 1,
					number: 1,
					filter: {
						attr: "autocomplete='off'",
						type: "textbox2",
						init: pq.filter.datepicker
					}
				},
				contain: {
					string: 1,
					numberList: 1,
					dateList: 1,
					filterFn: pq.filter.filterFnT
				},
				equal: {
					string: 1,
					bool: 1,
					date: 1,
					number: 1,
					filterFn: pq.filter.filterFnEq
				},
				empty: {
					string: 1,
					bool: 1,
					date: 1,
					number: 1,
					nr: 1
				},
				end: {
					string: 1,
					numberList: 1,
					dateList: 1,
					filterFn: pq.filter.filterFnT
				},
				great: {
					stringList: 1,
					number: 1,
					date: 1,
					filterFn: pq.filter.filterFnTD
				},
				gte: {
					stringList: 1,
					number: 1,
					date: 1,
					filterFn: pq.filter.filterFnTD
				},
				less: {
					stringList: 1,
					number: 1,
					date: 1,
					filterFn: pq.filter.filterFnTD
				},
				lte: {
					stringList: 1,
					number: 1,
					date: 1,
					filterFn: pq.filter.filterFnTD
				},
				notbegin: {
					string: 1,
					numberList: 1,
					dateList: 1,
					filterFn: pq.filter.filterFnT
				},
				notcontain: {
					string: 1,
					numberList: 1,
					dateList: 1,
					filterFn: pq.filter.filterFnT
				},
				notequal: {
					string: 1,
					date: 1,
					number: 1,
					bool: 1,
					filterFn: pq.filter.filterFnEq
				},
				notempty: {
					string: 1,
					bool: 1,
					date: 1,
					number: 1,
					nr: 1
				},
				notend: {
					string: 1,
					numberList: 1,
					dateList: 1,
					filterFn: pq.filter.filterFnT
				},
				range: {
					cascade: 1,
					string: 1,
					number: 1,
					date: 1,
					bool: 1,
					filterFn: pq.filter.filterFnSelect
				},
				regexp: {
					string: 1,
					numberList: 1,
					dateList: 1,
					filterFn: pq.filter.filterFnT
				}
			},
			getConditionsCol: function(e, t) {
				var n = t.conditionList || function(t) {
						t = t.getConditionsDT(pq.getDataType(e));
						return t.sort(), t
					}(this),
					t = t.conditionExclude,
					i = {};
				return t && (t.forEach(function(t) {
					i[t] = 1
				}), n = n.filter(function(t) {
					return !i[t]
				})), n
			},
			getConditionsDT: function(t) {
				var e, n, i, r = [],
					o = this.conditions;
				for (e in o) i = (n = o[e])[t + "List"], (n[t] && 0 !== i || i) && r.push(e);
				return r
			},
			getFilterUI: function(t, e) {
				var n = t.column,
					i = n.filterFn,
					n = (0 === t.indx ? n.filter : {}) || {},
					r = this.conditions[t.condition] || {},
					o = r.filterFn,
					r = r.filter || {},
					a = (delete n.type, i = i && i.call(e, t) || {}, o = o && o.call(this, t, e) || {}, c.extend({}, r, o, n, i));
				return a.condition = t.condition, a.init = [], a.options = [], [i, n, o, r].forEach(function(t) {
					t.init && a.init.push(t.init), t.options && a.options.push(t.options)
				}), a
			},
			options: function(t) {
				var e = t.column,
					t = t.filterUI,
					n = t.groupIndx,
					e = e.dataIndx;
				return this.getDataCascade(e, n, t.diExtra)
			},
			getOptions: function(t, e, n) {
				for (var i, r = e.options, o = t.dataIndx, a = {
						column: t,
						dataIndx: o,
						filterUI: e,
						condition: e.condition
					}, l = 0, s = r.length; l < s; l++)
					if ((i = r[l]) && (i = pq.isFn(i) ? i.call(n, a) : i)) return i = n.getPlainOptions(i, o), n.removeNullOptions(i, e.dataIndx || o, e.groupIndx);
				return []
			},
			rangeInit: function(t) {
				var i = this,
					r = i.options.appendMenuToTarget,
					o = t.column,
					a = t.$editor,
					e = t.headMenu,
					l = t.filterUI;
				e || a.parent().off("click keydown").on("click keydown", function(t) {
					var e, n = c.ui.keyCode;
					"keydown" == t.type && t.keyCode != n.DOWN && t.keyCode != n.ENTER || (t.preventDefault(), n = i.uuid + "_" + o.dataIndx, c("#" + n).length || (t = new pq.cFilterMenu.select(i, o), e = (n = c("<div id='" + n + "' style='width:270px;' class='pq-theme'><div></div></div>").appendTo(r ? i.$header : document.body)).children(), pq.makePopup(n[0], a, function() {
						a.focus()
					}), n.position({
						my: "left top",
						at: "left bottom",
						of: a
					}), t.create(e, l), pq.focusEle(null, n)))
				})
			},
			getType: function(t, e) {
				var n = this.conditions[t] || {},
					i = n.filterFn;
				return (n.filter || {}).type || (i ? i.call(this, {
					condition: t,
					column: e
				}) : {}).type
			}
		}), (y.cFilterData = m).conditions = {
			equal: function(t, e) {
				return t == e
			},
			notequal: function() {
				return !t.equal.apply(this, arguments)
			},
			contain: function(t, e) {
				return -1 != (t + "").indexOf(e)
			},
			notcontain: function() {
				return !t.contain.apply(this, arguments)
			},
			empty: function(t) {
				return 0 == t.length
			},
			notempty: function() {
				return !t.empty.apply(this, arguments)
			},
			begin: function(t, e) {
				return 0 == (t + "").indexOf(e)
			},
			notbegin: function() {
				return !t.begin.apply(this, arguments)
			},
			end: function(t, e) {
				var n = (t += "").lastIndexOf(e += "");
				if (-1 != n && n + e.length == t.length) return !0
			},
			notend: function() {
				return !t.end.apply(this, arguments)
			},
			regexp: function(t, e) {
				if (e.test(t)) return !(e.lastIndex = 0)
			},
			great: function(t, e) {
				return e < t
			},
			gte: function(t, e) {
				return e <= t
			},
			between: function(t, e, n) {
				return e <= t && t <= n
			},
			range: function(t, e) {
				return -1 != c.inArray(t, e)
			},
			less: function(t, e) {
				return t < e
			},
			lte: function(t, e) {
				return t <= e
			}
		});
	m.convert = function(t, e) {
		return null == t || "" === t ? "" : ("string" == e ? t = (t + "").trim().toUpperCase() : "date" == e ? t = Date.parse(t) : "number" == e ? +t == t && (t = +t) : "bool" == e && (t = String(t).toLowerCase()), t)
	}, m.convertEx = function(t, e, n, i) {
		var e = pq.getDataType({
				dataType: e
			}),
			r = pq.filter.conditions[n];
		return r[e] ? this.convert(t, e) : r.string ? (i && (t = pq.format(i, t)), "regexp" == n ? t : this.convert(t, "string")) : r.number ? this.convert(t, "number") : void 0
	}, m.prototype = {
		addMissingConditions: function(t) {
			var n = this.that;
			t.forEach(function(t) {
				var e = n.getColumn({
					dataIndx: t.dataIndx
				}).filter || {};
				t.condition = void 0 === t.condition ? pq.filter.getVal(e)[2] : t.condition
			})
		},
		clearFilters: function(t) {
			t.forEach(function(t) {
				var t = t.filter,
					e = pq.filter.conditions;
				t && (t.crules || []).forEach(function(t) {
					(e[t.condition] || {}).nr && (t.condition = void 0), t.value = t.value2 = void 0
				})
			})
		},
		compatibilityCheck: function(t) {
			var e = t.data,
				n = "Incorrect filter parameters. Please check upgrade guide";
			if (e)
				if (e = e[0]) {
					if (e.hasOwnProperty("dataIndx") && e.hasOwnProperty("value")) throw n
				} else if (!t.rules) throw n
		},
		copyRuleToColumn: function(t, e, n) {
			var e = e.filter = e.filter || {},
				i = t.crules || [],
				r = i[0],
				o = (r || t).condition,
				a = (r || t).value,
				l = (r || t).value2;
			"remove" == n ? (e.on = !1, e.crules = o ? [{
				condition: o,
				value: "range" == o ? [] : void 0
			}] : void 0) : (e.on = !0, e.mode = t.mode, e.crules = r ? i : [{
				condition: o,
				value: a,
				value2: l
			}])
		},
		filter: function(t) {
			this.compatibilityCheck(t = t || {});
			var e, n, i = this.that,
				r = i.options,
				o = !1,
				a = t.data,
				l = t.rules = t.rules || (t.rule ? [t.rule] : []),
				s = !a,
				d = r.dataModel.location,
				r = r.filterModel,
				c = r.type,
				r = t.mode || r.mode,
				u = t.oper,
				h = "replace" == u,
				f = s ? i.colModel : this.getCMFromRules(l),
				p = 0,
				g = l.length;
			if ("remove" != u && this.addMissingConditions(l), s) {
				if (!1 === i._trigger("beforeFilter", null, t)) return;
				for (null != t.header && (o = t.header), h && this.clearFilters(f); p < g; p++) e = l[p], n = i.getColumn({
					dataIndx: e.dataIndx
				}), this.copyRuleToColumn(e, n, u)
			} else
				for (; p < g; p++) e = l[p], n = f[p], this.copyRuleToColumn(e, n);
			s = {
				header: o,
				CM: f,
				data: a,
				rules: l,
				mode: r
			};
			if ("local" == d || "local" == c) return s.source = "filter", s.trigger = !1, i._onDataAvailable(s);
			i.refreshDataAndView(s)
		},
		hideRows: function(t, e, n) {
			for (var i, r = 0, o = e.length; r < o; r++) i = e[r], t.length ? i.pq_hidden = i.pq_filter = !this.isMatchRow(i, t, n) : i.pq_filter && (delete i.pq_filter, delete i.pq_hidden)
		},
		filterLocalData: function(t) {
			var e = this.that,
				n = (t = t || {}).data,
				i = !n,
				r = i ? e.colModel : t.CM,
				o = this.getRulesFromCM({
					CM: r,
					apply: i
				}),
				r = e.options,
				a = r.dataModel,
				l = e.iSort,
				s = n || a.data,
				d = a.dataUF = a.dataUF || [],
				c = [],
				u = [],
				n = r.filterModel,
				h = t.mode || n.mode,
				r = {
					filters: o,
					mode: h,
					data: s
				};
			if (n.hideRows) !(r.hideRows = !0) !== e._trigger("customFilter", null, r) && this.hideRows(o, s, h);
			else {
				if (i)
					if (d.length) {
						for (var f = !0, p = 0, g = d.length; p < g; p++) s.push(d[p]);
						d = a.dataUF = []
					} else {
						if (!o.length) return {
							data: s,
							dataUF: d
						};
						l.saveOrder()
					} if (n.on && h && o && o.length) {
					if (s.length)
						if (!1 === e._trigger("customFilter", null, r)) c = r.dataTmp, u = r.dataUF;
						else
							for (p = 0, g = s.length; p < g; p++) {
								var m = s[p];
								(this.isMatchRow(m, o, h) ? c : u).push(m)
							}
					s = c, d = u, 0 == l.readSorter().length && (s = l.sortLocalData(s)), i && (a.data = s, a.dataUF = d)
				} else f && i && (!(r = {
					data: s = 0 == l.readSorter().length ? l.sortLocalData(s) : s
				}) === e._trigger("clearFilter", null, r) && (s = r.data), a.data = s, e._queueATriggers.filter = {
					ui: {
						type: "local"
					}
				})
			}
			return i && (e._queueATriggers.filter = {
				ui: {
					type: "local",
					rules: o
				}
			}), {
				data: s,
				dataUF: d
			}
		},
		_getRulesFromCM: function(t, e, n, i, r, o, a) {
			if ("between" == n) "" === i || null == i ? i = a(r, o, n = "lte") : "" === r || null == r ? i = a(i, o, n = "gte") : (i = a(i, o, n), r = a(r, o, n));
			else if ("regexp" == n) {
				if ("remote" == t) i = i.toString();
				else if (pq.isStr(i)) try {
					var l = e.modifiers || "gi";
					i = new RegExp(i, l)
				} catch (t) {
					i = /.*/
				}
			} else if ("range" == n || c.isArray(i)) {
				if (null == i) return;
				if (pq.isFn(i.push)) {
					if (0 === i.length) return;
					if ("range" != n) i = a(i[0], o, n);
					else
						for (var s = 0, d = (i = i.slice()).length; s < d; s++) i[s] = a(i[s], o, n)
				}
			} else n && (i = a(i, o, n), null != r && (r = a(r, o, n)));
			l = "remote" == t ? "" : ((e.conditions || {})[n] || {}).compare || pq.filter.conditions[n].compare || m.conditions[n];
			return [i, r, l, n]
		},
		getRulesFromCM: function(t) {
			var e = t.CM;
			if (!e) throw "CM N/A";

			function n(t, e, n) {
				return l ? (t = null == t ? "" : t).toString() : d.convertEx(t, e, n)
			}
			for (var i = this, r = e.length, o = 0, a = t.location, l = "remote" === a, s = [], d = y.cFilterData; o < r; o++) {
				var c, u, h, f, p, g, m, v, w = e[o],
					x = w.filter;
				x && (c = w.dataIndx, v = w.dataType, h = x.crules || [x], u = [], v = !v || "stringi" == v || pq.isFn(v) ? "string" : v, h.forEach(function(t) {
					m = t.condition, f = t.value, p = t.value2, m && i.isCorrect(m, f, p) && (m = i._getRulesFromCM(a, x, m, f, p, v, n)) && (f = m[0], p = m[1], g = m[2], u.push({
						condition: m[3],
						value: f,
						value2: p,
						cbFn: g
					}))
				}), u.length && (h = {
					dataIndx: c,
					dataType: v
				}, l && 1 == u.length ? (h.value = u[0].value, h.value2 = u[0].value2, h.condition = u[0].condition) : (h.crules = u, h.mode = x.mode, l || (h.column = w)), s.push(h)))
			}
			return (t.apply || l) && this.sortRulesAndFMIndx(s), s
		},
		getCMFromRules: function(t) {
			var e = this.that;
			return t.map(function(t) {
				t = e.getColumn({
					dataIndx: t.dataIndx
				});
				return pq.copyObj({}, t, ["parent"])
			})
		},
		getQueryStringFilter: function() {
			var t = this.that,
				e = t.options,
				n = e.stringify,
				e = e.filterModel,
				i = e.mode,
				r = t.colModel,
				o = e.newDI || [],
				r = this.getRulesFromCM({
					CM: r,
					location: "remote"
				}),
				a = "";
			return e && e.on && r && (r.length ? (e = {
				mode: i,
				data: r
			}, a = n ? JSON.stringify(e) : e) : (a = "", o.length && t._trigger("clearFilter"))), a
		},
		isCorrect: function(t, e, n) {
			t = pq.filter.conditions[t];
			if (t) return !!(null != e && "" !== e || null != n && "" !== n || t.nr);
			throw "filter condition NA"
		},
		isMatchCell: function(t, e) {
			for (var n, i, r, o, a = t.dataIndx, l = this.that, s = t.column, d = t.dataType, c = t.mode, u = [], h = t.crules, f = h.length, p = e[a], g = 0; g < f; g++) o = (r = h[g]).condition, n = r.value, i = r.value2, r = r.cbFn, o && (o = "regexp" === o ? null == p ? "" : p : m.convertEx(p, d, o, s), u.push(!!r.call(l, o, n, i, e, s)));
			if (f = u.length, "AND" === c) {
				for (g = 0; g < f; g++)
					if (!u[g]) return !1;
				return !0
			}
			for (g = 0; g < f; g++)
				if (u[g]) return !0;
			return !1
		},
		isMatchRow: function(t, e, n) {
			var i, r, o = 0,
				a = e.length,
				l = "AND" == n,
				s = !l;
			if (0 == a) return !0;
			for (; o < a; o++) {
				if (i = e[o], (r = this.isMatchCell(i, t)) && (i.found = !0), s && r) return !0;
				if (l && !r) return !1
			}
			return l
		},
		onFilterChange: function() {
			function e(t, e) {
				for (var n = r.getColIndx({
						dataIndx: e
					}), i = 0; i <= 1; i++) r[t]({
					ri: a.length - i,
					colIndx: n,
					cls: l
				})
			}
			var r = this.that,
				t = r.options,
				n = t.filterModel,
				i = "remote" == n.type,
				o = n.oldDI || [],
				t = !t.dataModel.data.length,
				a = r.headerCells,
				l = "pq-col-filtered",
				s = i || t,
				i = (n.rules || []).reduce(function(t, e) {
					return (e.found || s) && t.push(e.dataIndx), t
				}, []);
			o.forEach(function(t) {
				e("removeClassHead", t)
			}), i.forEach(function(t) {
				e("addClassHead", t)
			}), n.oldDI = n.newDI = i
		},
		onLoad: function() {
			var t = this.that.options.dataModel.dataUF;
			t && (t.length = 0)
		},
		sortRulesAndFMIndx: function(t) {
			var e = this.that.options.filterModel,
				n = e.newDI;
			t.sort(function(t, e) {
				t = t.dataIndx, e = e.dataIndx, t = n.indexOf(t), e = n.indexOf(e);
				return 0 <= t && 0 <= e ? t - e : 0 <= t ? -1 : 0 <= e ? 1 : 0
			}), e.rules = t
		}
	}
}(jQuery), ! function(c) {
	var t = c.paramquery,
		e = t.cSort = function(t) {
			this.that = t, this.sorters = [], this.tmpPrefix = "pq_tmp_", this.cancel = !1
		},
		x = (t.pqGrid.prototype.sort = function(t) {
			if ((t = t || {}).data) return this.iSort._sortLocalData(t.sorter, t.data);
			var e, n, i, r, o, a = this,
				l = a.options,
				s = l.dataModel,
				d = s.data,
				c = s.location,
				u = l.sortModel.type;
			(d && d.length || "local" != u) && (l = l.editModel, n = (e = a.iSort).getSorter(), i = t.evt, r = null == t.single ? e.readSingle() : t.single, o = e.readCancel(), ((o = t.sorter ? t.addon ? (t.single = r, t.cancel = o, e.addon(t)) : t.sorter : e.readSorter()).length || n.length) && (l.indices && a.blurEditor({
				force: !0
			}), !(l = {
				dataIndx: o.length ? o[0].dataIndx : null,
				oldSorter: n,
				sorter: o,
				source: t.source,
				single: r
			}) === a._trigger("beforeSort", i, l) ? e.cancelSort() : (e.resumeSort(), "local" == u && e.saveOrder(), e.setSorter(o), e.setSingle(r), e.writeSorter(o), e.writeSingle(r), "local" == u ? (s.data = e.sortLocalData(d, !t.skipCustomSort, d[0] == a.pdata[0] ? "pq_order" : "pq_gorder"), !(a._queueATriggers.sort = {
				evt: i,
				ui: l
			}) !== t.refresh && a.refreshView()) : "remote" == u && (a._queueATriggers.sort = {
				evt: i,
				ui: l
			}, t.initByRemote || !1 !== a._trigger("customSort") && ("lazy" == c ? a.iLazy.init({
				initBySort: !0
			}) : a.remoteRequest({
				initBySort: !0,
				callback: function() {
					a._onDataAvailable()
				}
			}))))))
		}, e.prototype = {
			addon: function(t) {
				var e, n, i = (t = t || {}).sorter[0],
					r = i.dataIndx,
					o = i.dir,
					a = t.single,
					l = t.cancel,
					s = this.readSorter(),
					d = s[0];
				if (null == a) throw "sort single N/A";
				return null != r && (a && !t.tempMultiple ? (d = (s = s.length ? [s[0]] : [])[0]) && d.dataIndx == i.dataIndx ? "" === (n = "up" === (e = d.dir) ? "down" : l && "down" === e ? "" : "up") ? s.length-- : d.dir = n : s[0] = c.extend({}, i, {
					dir: n = o || "up"
				}) : -1 < (a = this.inSorters(s, r)) ? "up" == (e = s[a].dir) ? s[a].dir = "down" : (!l || "down" != e) && 1 == s.length ? s[a].dir = "up" : s.splice(a, 1) : s.push(c.extend({}, i, {
					dir: "up"
				}))), s
			},
			cancelSort: function() {
				this.cancel = !0
			},
			resumeSort: function() {
				this.cancel = !1
			},
			readSorter: function() {
				var t = this.that,
					e = t.columns,
					t = (t.options.sortModel.sorter || []).filter(function(t) {
						return !!e[t.dataIndx]
					});
				return pq.arrayUnique(t, "dataIndx")
			},
			setSingle: function(t) {
				this.single = t
			},
			getSingle: function() {
				return this.single
			},
			readSingle: function() {
				return this.that.options.sortModel.single
			},
			setCancel: function(t) {
				this.cancel = t
			},
			readCancel: function() {
				return this.that.options.sortModel.cancel
			},
			saveOrder: function(t) {
				t = t || "pq_order";
				var e = this.that.get_p_data(),
					n = e.find(function(t) {
						return t && !t.pq_gtitle && !t.pq_gsummary
					});
				if (n && null == n[t] || !n)
					for (var i, r = 0, o = (i = e).length; r < o; r++)(n = i[r]) && (n[t] = r)
			},
			getCancel: function() {
				return this.cancel
			},
			getQueryStringSort: function() {
				if (this.cancel) return "";
				var t = this.that,
					e = this.sorters,
					t = t.options.stringify;
				return e.length ? t ? JSON.stringify(e) : e : ""
			},
			getSorter: function() {
				return this.sorters
			},
			setSorter: function(t) {
				this.sorters = t.slice(0)
			},
			inSorters: function(t, e) {
				for (var n = 0; n < t.length; n++)
					if (t[n].dataIndx == e) return n;
				return -1
			},
			sortLocalData: function(t, e, n) {
				n = n || "pq_order";
				var i = this.sorters;
				return i.length || t.length && null != t[0][n] && (i = [{
					dataIndx: n,
					dir: "up",
					dataType: "integer"
				}]), this._sortLocalData(i, t, e)
			},
			compileSorter: function(t, e) {
				var n = this.that,
					i = n.columns,
					n = n.options,
					r = [],
					o = [],
					a = [],
					l = this.tmpPrefix,
					s = n.sortModel,
					d = s.useCache,
					c = s.ignoreCase,
					u = t.length;
				e = e || n.dataModel.data;
				for (var h = 0; h < u; h++) {
					var f = t[h],
						p = f.sortIndx || f.dataIndx,
						g = i[p] || {},
						m = "up" == (f.dir = f.dir || "up") ? 1 : -1,
						v = pq.getFn(g.sortType),
						g = "string" == (g = g.dataType || f.dataType || "string") && c ? "stringi" : g,
						f = d && "date" == g,
						w = f ? l + p : p;
					o[h] = w, a[h] = m, v ? r[h] = function(r, o) {
						return function(t, e, n, i) {
							return o(t, e, n, i, r)
						}
					}(v, x.sort_sortType) : "integer" == g || "float" == g ? r[h] = x.sort_number : pq.isFn(g) ? r[h] = function(r, o) {
						return function(t, e, n, i) {
							return o(t, e, n, i, r)
						}
					}(g, x.sort_dataType) : r[h] = "date" == g ? x["sort_date" + (f ? "_fast" : "")] : "bool" == g ? x.sort_bool : "stringi" == g ? x.sort_locale : x.sort_string, f && this.addCache(e, g, p, w)
				}
				return this._composite(r, o, a, u)
			},
			_composite: function(r, o, a, l) {
				return function(t, e) {
					for (var n = 0, i = 0; i < l && 0 == (n = r[i](t, e, o[i], a[i])); i++);
					return n
				}
			},
			_sortLocalData: function(t, e, n) {
				if (!e) return [];
				if (!e.length) return e;
				var i = this.that,
					r = i.options.sortModel,
					o = this.compileSorter(t, e),
					a = {
						sort_composite: o,
						data: e,
						sorter: t
					};
				return t && t.length ? (n && !1 === i._trigger("customSort", null, a) ? e = a.data : e.sort(o), r.useCache && this.removeCache(t, e)()) : i._trigger("cancelSort", null, a), e
			},
			addCache: function(t, e, n, i) {
				for (var r = x["get_" + e], o = t.length; o--;) {
					var a = t[o];
					a[i] = r(a[n])
				}
			},
			removeCache: function(r, o) {
				var a = this.tmpPrefix;
				return function() {
					for (var t = r.length; t--;) {
						var e = r[t],
							n = a + e.dataIndx,
							i = o.length;
						if (i && o[0].hasOwnProperty(n))
							for (; i--;) delete o[i][n]
					}
				}
			},
			writeCancel: function(t) {
				this.that.options.sortModel.cancel = t
			},
			writeSingle: function(t) {
				this.that.options.sortModel.single = t
			},
			writeSorter: function(t) {
				this.that.options.sortModel.sorter = t
			}
		}, {
			get_date: function(t) {
				return !t || isNaN(t = Date.parse(t)) ? 0 : t
			},
			sort_number: function(t, e, n, i) {
				t = t[n], e = e[n];
				return ((t = t ? +t : 0) - (e = e ? +e : 0)) * i
			},
			sort_date: function(t, e, n, i) {
				t = t[n], e = e[n];
				return ((t = t ? Date.parse(t) : 0) - (e = e ? Date.parse(e) : 0)) * i
			},
			sort_date_fast: function(t, e, n, i) {
				return (t[n] - e[n]) * i
			},
			sort_dataType: function(t, e, n, i, r) {
				return r(t[n], e[n]) * i
			},
			sort_sortType: function(t, e, n, i, r) {
				return r(t, e, n) * i
			},
			sort_string: function(t, e, n, i) {
				t = t[n] || "", e = e[n] || "", n = 0;
				return e < t ? n = 1 : t < e && (n = -1), n * i
			},
			sort_locale: function(t, e, n, i) {
				t = t[n] || "", e = e[n] || "";
				return t.localeCompare(e) * i
			},
			sort_bool: function(t, e, n, i) {
				t = t[n], e = e[n], n = 0;
				return t && !e || !1 === t && null == e ? n = 1 : (e && !t || !1 === e && null == t) && (n = -1), n * i
			}
		});
	pq.sortObj = x
}(jQuery), ! function() {
	function t(n) {
		var i = this;
		i.that = n, i.mc = null, n.on("dataReadyDone colMove groupShowHide hideCols", function(t, e) {
			n.options.mergeCells && "pager" !== e.source && i.init()
		}), n.on("colAdd colRemove", i.alterColumn.bind(i)).on("change", i.onChange.bind(i)), n.Merge = function() {
			return i
		}
	}(jQuery.paramquery.cMerge = t).prototype = {
		auto: function(t, a) {
			var l = this.that,
				s = l.pdata;
			return a = a || [], t.forEach(function(t) {
				for (var e = 1, n = l.colIndxs[t], i = s.length; i--;) {
					var r = s[i][t],
						o = s[i - 1] ? s[i - 1][t] : void 0;
					void 0 !== o && r == o ? e++ : 1 < e && (a.push({
						r1: i,
						c1: n,
						rc: e,
						cc: 1
					}), e = 1)
				}
			}), a
		},
		calcVisibleColumns: function(t, e, n, i) {
			var r = 0,
				o = t.length;
			for (n = o < n ? o : n; e < n; e++) i(t[e]) || r++;
			return r
		},
		calcVisibleRows: function(t, e, n, i) {
			var r = 0,
				o = e,
				e = t.length;
			for (n = e < n ? e : n; o < n; o++) i(t[o]) || r++;
			return r
		},
		findNextVisibleColumn: function(t, e, n, i) {
			for (var r, o = e; o < e + n; o++) {
				if (!(r = t[o])) return -1;
				if (!i(r)) return o
			}
		},
		findNextVisibleRow: function(t, e, n, i) {
			for (var r, o = e; o < e + n; o++) {
				if (!(r = t[o])) return -1;
				if (!i(r)) return o
			}
		},
		getData: function(t, e, n) {
			var i = this.mc;
			if (i[t] && (i = i[t][e])) return (t = i.data) ? t[n] : null
		},
		inflateRange: function(t, e, n, i) {
			var r = this.that,
				o = !1,
				a = r.riOffset + r.pdata.length - 1,
				l = r.colModel.length - 1,
				s = this.mc2;
			if (!s) return [t, e, n, i];
			for (var d = 0, c = s.length; d < c; d++) {
				var u = s[d],
					h = u.r1,
					f = u.c1,
					p = a < (p = h + u.rc - 1) ? a : p,
					u = l < (u = f + u.cc - 1) ? l : u;
				if ((h < t && t <= p || h <= n && n < p) && e <= u && f <= i || (f < e && e <= u || f <= i && i < u) && t <= p && h <= n) {
					o = !0, t = h < t ? h : t, e = f < e ? f : e, n = n < p ? p : n, i = i < u ? u : i;
					break
				}
			}
			return o ? this.inflateRange(t, e, n, i) : [t, e, n, i]
		},
		init: function(t, e) {
			var n = this.that,
				i = n.colModel,
				r = n.options.mergeCells || [],
				o = n.get_p_data(),
				a = [],
				l = [];
			t = t || function(t) {
				return t.hidden
			}, e = e || function(t) {
				return t.pq_hidden
			};
			for (var s = 0, d = r.length; s < d; s++) {
				var c = r[s],
					u = c.r1,
					h = u,
					f = o[u],
					p = c.c1,
					g = p,
					m = i[p],
					v = c.rc,
					w = c.cc;
				if (m && f && (t(m) && (g = this.findNextVisibleColumn(i, p, w, t)), m = this.calcVisibleColumns(i, p, p + w, t), e(f) && (h = this.findNextVisibleRow(o, u, v, e)), !((f = this.calcVisibleRows(o, u, u + v, e)) < 1 || m < 1))) {
					a.push({
						r1: u,
						c1: p,
						rc: v,
						cc: w
					}), l[h] = l[h] || [];
					for (var x = {
							show: !(l[h][g] = {
								show: !0,
								rowspan: f,
								colspan: m,
								o_rowspan: v,
								o_colspan: w,
								style: c.style,
								cls: c.cls,
								attr: c.attr,
								r1: u,
								c1: p,
								v_r1: h,
								v_c1: g
							}),
							r1: u,
							c1: p,
							v_r1: h,
							v_c1: g
						}, y = u; y < u + v; y++) {
						l[y] = l[y] || [];
						for (var C = p; C < p + w; C++) y == h && C == g || (l[y][C] = x)
					}
				}
			}
			n._mergeCells = 0 < l.length, this.mc = l, this.mc2 = a
		},
		ismergedCell: function(t, e) {
			var n, i, r = this.mc;
			return !!(r && r[t] && (n = r[t][e])) && (r = n.v_r1, i = n.v_c1, t != r || e != i || {
				o_ri: n.r1,
				o_ci: n.c1,
				v_rc: n.rowspan,
				v_cc: n.colspan,
				o_rc: n.o_rowspan,
				o_cc: n.o_colspan
			})
		},
		isRootCell: function(t, e, n) {
			var i = this.mc;
			if (i && i[t] && (r = i[t][e])) {
				if ("o" == n) return t == r.r1 && e == r.c1;
				var n = r.v_r1,
					r = r.v_c1;
				return n == t && r == e ? {
					rowspan: (t = i[n][r]).rowspan,
					colspan: t.colspan
				} : void 0
			}
		},
		removeData: function(t, e, n) {
			this.that;
			var i = this.mc;
			i && i[t] && (i = i[t][e]) && ((t = i.data) && (t[n] = null))
		},
		getRootCell: function(t, e) {
			var n, i = this.mc;
			if (i && i[t] && (t = i[t][e])) return e = t.v_r1, n = t.v_c1, {
				o_ri: (t = i[e][n]).r1,
				o_ci: t.c1,
				v_ri: e,
				v_ci: n,
				v_rc: t.rowspan,
				v_cc: t.colspan,
				o_rc: t.o_rowspan,
				o_cc: t.o_colspan
			}
		},
		getRootCellO: function(t, e, n, i) {
			var r, i = "o" == (i = i || "o"),
				o = this.getRootCell(t, e);
			return o ? (r = {
				rowIndx: o[i ? "o_ri" : "v_ri"],
				colIndx: o[i ? "o_ci" : "v_ci"]
			}, this.that.normalize(r)) : (r = n ? {
				rowIndx: t,
				colIndx: e
			} : r) ? this.that.normalize(r) : null
		},
		getRootCellV: function(t, e, n) {
			return this.getRootCellO(t, e, n, "v")
		},
		getClsStyle: function(t, e) {
			return this.mc[t][e]
		},
		getMergeCells: function(t, e) {
			for (var n, i, r, o = this.that, a = this.mc2, l = o.riOffset, s = l + e, d = [], c = a ? a.length : 0, u = 0; u < c; u++) i = (n = a[u]).r1, r = n.c1, (!t || l <= i && i < s) && (t && (i -= l), d.push({
				r1: i,
				c1: r,
				r2: i + n.rc - 1,
				c2: r + n.cc - 1
			}));
			return d
		},
		alterColumn: function(t, e) {
			for (var n = this.that.options, e = e.args, i = e[1], r = "number" != typeof(o = e[0]), o = r ? o.length : o, a = n.mergeCells || [], l = 0, s = a.length; l < s; l++) {
				var d = a[l],
					c = d.c1,
					u = d.cc;
				r ? i <= c ? d.c1 = c + o : i < c + u && (d.cc = u + o) : i < c ? d.c1 = c - o : i < c + u && 0 < u - o && (d.cc = u - o), d.c2 = null
			}
			this.init()
		},
		onChange: function(t, e) {
			for (var n, i = this.that.options, r = e.addList, o = e.deleteList, a = i.mergeCells || [], l = 0, s = a.length; l < s; l++) {
				for (var d = a[l], c = d.r1, u = d.rc, h = 0, f = r.length; h < f; h++)(n = r[h].rowIndx) <= c ? (c = d.r1 = c + 1, d.r2 = null) : n < c + u && (u = d.rc = u + 1, d.r2 = null);
				for (h = 0, f = o.length; h < f; h++)(n = o[h].rowIndx) < c ? (c = d.r1 = c - 1, d.r2 = null) : n < c + u && 1 < u && (u = d.rc = u - 1, d.r2 = null)
			}
			this.init()
		},
		setData: function(t, e, n) {
			var i = this.mc;
			i[t] && (i = i[t][e]) && (i.data = n)
		}
	}
}(), ! function(f) {
	var t = f.paramquery,
		e = pq.mixin,
		p = (t.pqGrid.defaults.groupModel = {
			cascade: !0,
			cbId: "pq_group_cb",
			collapsed: [],
			dataIndx: [],
			fixCols: !0,
			groupCols: [],
			header: !0,
			headerMenu: !0,
			icon: ["ui-icon-triangle-1-se", "ui-icon-triangle-1-e"],
			id: "pq_gid",
			parentId: "parentId",
			childstr: "children",
			menuItems: ["merge", "fixCols", "grandSummary"],
			on: !1,
			refreshOnChange: !0,
			pivotColsTotal: "after",
			separator: "_",
			source: "checkboxGroup",
			showSummary: [],
			summaryInTitleRow: "collapsed",
			summaryEdit: !0,
			title: [],
			titleDefault: "{0} ({1})"
		}, pq.aggregate = {
			sum: function(t) {
				for (var e, n = 0, i = t.length; i--;) null != (e = t[i]) && (n += +e);
				return n
			},
			avg: function(t, e) {
				try {
					var n = pq.formulas.AVERAGE(t)
				} catch (t) {
					n = t
				}
				return isNaN(n) ? null : n
			},
			flatten: function(t) {
				return t.filter(function(t) {
					return null != t
				})
			},
			max: function(t, e) {
				var n, i, r, o, a, e = pq.getDataType(e);
				if (n = (t = this.flatten(t)).length) {
					if ("number" == e)
						for (i = +t[0]; n--;) i = i < (r = t[n]) || isNaN(i) ? r : i;
					else if ("date" == e) {
						for (i = Date.parse(t[0]), o = t[0]; n--;)(i < (a = Date.parse(t[n])) || isNaN(i)) && (i = a, o = t[n]);
						i = o
					} else t.sort(), i = t[n - 1];
					return i
				}
			},
			min: function(t, e) {
				var n, i, r, o, e = pq.getDataType(e);
				if (o = (t = this.flatten(t)).length) {
					if ("number" == e)
						for (n = +t[0]; o--;) n = (i = +t[o]) < n || isNaN(n) ? i : n;
					else if ("date" == e) {
						for (n = Date.parse(t[0]), r = t[0]; o--;)((i = Date.parse(t[o])) < n || isNaN(n)) && (n = i, r = t[o]);
						n = r
					} else t.sort(), n = t[0];
					return n
				}
			},
			count: function(t) {
				return this.flatten(t).length
			},
			stdev: function(t) {
				try {
					var e = pq.formulas.STDEV(t)
				} catch (t) {
					e = t
				}
				return isNaN(e) ? null : e
			},
			stdevp: function(t) {
				try {
					var e = pq.formulas.STDEVP(t)
				} catch (t) {
					e = t
				}
				return isNaN(e) ? null : e
			}
		}, t.cGroup = function(t) {
			var e = this,
				n = t.options,
				i = e.Model = n.groupModel;
			e.cbId = i.cbId, e.childstr = i.childstr, e.id = i.id, e.parentId = i.parentId, e.isGroup = !0, e.cache = {}, e.oldEditor = n.editor, e.prop = "pq_group_prop", e.that = t, Object.defineProperty(i, "nodeClose", {
				get: function() {
					return e.fillState({})
				},
				set: function(t) {
					e.nodeClose = t
				}
			}), t.one("CMInit", function() {
				e.addAggGetter(i)
			}), i.on && e.init()
		});
	p.beforeTrigger = function(e, n) {
		return function(t) {
			return !1 === n._trigger("beforeGroupExpand", e, t)
		}
	}, p.onGroupItemClick = function(i) {
		return function(t) {
			var e = f(t.target),
				n = f(this).data("indx");
			e.hasClass("pq-group-remove") ? i.removeGroup(n) : i.toggleLevel(n, t)
		}
	}, p.prototype = f.extend({}, e.ChkGrpTree, e.GrpTree, {
		addAggGetter: function(t) {
			var e = t.agg,
				i = this;
			Object.defineProperty(t, "agg", {
				get: function() {
					var e, n = {};
					return i.getCMPrimary().forEach(function(t) {
						(e = t.summary) && e.type && (n[t.dataIndx] = e.type)
					}), n
				},
				set: function(n) {
					i.getCMPrimary().forEach(function(t) {
						var e = t.dataIndx,
							e = n[e];
						e ? (t.summary = t.summary || {}).type = e : (e = t.summary) && delete e.type
					})
				}
			}), e && (t.agg = e)
		},
		addGroup: function(t, e) {
			var n = this,
				i = n.that.options.groupModel.dataIndx || [],
				r = pq.objectify(i),
				i = i.slice();
			null == t || r[t] || (null == e ? i.push(t) : i.splice(e, 0, t), n.option({
				dataIndx: i
			}, "", "", function() {
				n.triggerChange()
			}))
		},
		createHeader: function() {
			for (var t = this.that, e = this.$header, n = t.options, i = t.columns, r = n.groupModel, o = r.dataIndx, a = o.length; a--;) null == i[o[a]] && o.splice(a, 1);
			if (a = o.length, r.header && r.on) {
				if (e ? e.empty() : (e = this.$header = f("<div class='pq-group-header ui-helper-clearfix' ></div>").appendTo(t.$top)).on("click", ".pq-group-item", p.onGroupItemClick(this)), a) {
					for (var l = [], s = 0; s < a; s++) {
						var d = o[s],
							c = i[d],
							u = r.collapsed,
							h = r.icon,
							u = u[s] ? h[1] : h[0];
						l.push("<div tabindex='0' class='pq-group-item' data-indx='", d, "' >", "<span class='", this.toggleIcon, u, "' ></span>", c.pq_title || ("string" == typeof c.title ? c.title : d), "<span class='", this.groupRemoveIcon, "' ></span></div>")
					}
					e[0].innerHTML = l.join("")
				}
				this.initHeader(n, r)
			} else e && (e.remove(), this.$header = null)
		},
		collapse: function(t) {
			this.expand(t, !0)
		},
		collapseAll: function(t) {
			this.expandAll(t, !0)
		},
		collapseTo: function(t) {
			this.expandTo(t, !0)
		},
		concat: function() {
			var r = this.parentId,
				o = this.id,
				a = this.childstr;
			return function(e, t, n) {
				var i = n[o];
				return t.forEach(function(t) {
					t[r] = i, e.push(t)
				}), n[a] = t, e
			}
		},
		editorSummary: function(t, s) {
			var d = this,
				c = d.oldEditor;
			return function(t) {
				var e = t.rowData;
				if (e.pq_gsummary || e.pq_gtitle) {
					var n, i, e = pq.aggregate,
						r = t.column,
						o = r.summary,
						o = o ? o.edit : null,
						a = f.inArray,
						r = r.dataType,
						l = [""];
					if (-1 < a(t.dataIndx, s.dataIndx)) return !1;
					if (!s.summaryEdit && !o || !1 === o) return !1;
					for (i in n = d.getAggOptions(r), e) - 1 < a(i, n) && l.push(i);
					return 1 == l.length ? !1 : {
						type: "select",
						prepend: s.prepend,
						options: s.options || l,
						valueIndx: s.valueIndx,
						labelIndx: s.labelIndx,
						init: s.init || d.editorInit,
						getData: s.getData || d.editorGetData
					}
				}
				return "function" == typeof c ? c.call(d.that, t) : c
			}
		},
		editorInit: function(t) {
			var e = t.column.summary,
				n = this.options.groupModel.dataIndx,
				n = (e = e || (t.column.summary = {}))[n[t.rowData.pq_level]] || e.type;
			t.$cell.find("select").val(n)
		},
		editorGetData: function(t) {
			var n = t.column,
				e = this.options.groupModel.dataIndx[t.rowData.pq_level],
				i = n.dataType,
				r = n.summary,
				t = t.$cell.find("select").val();
			return r[r[e] ? e : "type"] = t, this.one("beforeValidate", function(t, e) {
				e.allowInvalid = !0, e.track = !1, e.history = !1, n.dataType = "string", this.one(!0, "change", function(t, e) {
					n.dataType = i
				})
			}), t
		},
		expandTo: function(t, e) {
			for (var n, i = this.that, r = !!e, o = t.split(","), a = o.length, l = this.childstr, s = this.getRoots(i.pdata), d = 0; d < a && (n = s[o[d]]);) r || (n.pq_close = r), s = n[l], d++;
			n && (n.pq_close = r, !1 !== i._trigger("group", null, {
				node: n,
				close: r
			}) && this.softRefresh())
		},
		expandAll: function(e, n) {
			e = e || 0, n = !!n, !1 !== this.trigger({
				all: !0,
				close: n,
				level: e
			}) && (this.that.pdata.forEach(function(t) {
				t.pq_level >= e && (t.pq_close = n)
			}), this.createHeader(), this.softRefresh())
		},
		expand: function(e, n) {
			e = e || 0, !1 !== this.trigger({
				close: !!n,
				level: e
			}) && (this.that.pdata.forEach(function(t) {
				t.pq_level == e && (t.pq_close = n)
			}), this.createHeader(), this.softRefresh())
		},
		flattenG: function(n, i, u, t) {
			var h = u.dataIndx,
				f = this.id,
				p = this.parentId,
				g = this.childstr,
				m = u.separator,
				v = u.titleIndx,
				w = this.concat(),
				x = h.length,
				y = [];
			return function r(t, e, o, a) {
				if (!x) return t;
				var l = e || 0,
					s = (o = o || {})[g],
					d = h[l],
					c = u.collapsed[l];
				return i(t, d, n[d]).forEach(function(t) {
					var e = t[1],
						t = t[0],
						n = (a ? a + m : "") + t,
						i = e.length,
						i = {
							pq_gtitle: !0,
							pq_level: l,
							pq_close: c,
							pq_items: i
						};
					i[f] = n, i[p] = o[f], i[g] = [], i[d] = t, v && (i[v] = t), y.push(i), s && s.push(i), l + 1 < x ? r(e, l + 1, i, n) : y = w(y, e, i)
				}), y
			}
		},
		getAggOptions: function(t) {
			return "integer" == t || "float" == t ? t = "number" : "date" !== t && (t = "string"), this.that.options.summaryOptions[t].split(",")
		},
		getVal: function(i) {
			var r = f.trim;
			return function(t, e, n) {
				t = t[e], e = n.groupChange;
				return e ? (e = pq.getFn(e))(t) : (t = r(t), i ? t.toUpperCase() : t)
			}
		},
		getSumCols: function() {
			return this._sumCols
		},
		getSumDIs: function() {
			return this._sumDIs
		},
		group: function(l) {
			return function(t, i, r) {
				var o = {},
					a = [];
				return t.forEach(function(t) {
					t.pq_hidden = void 0;
					var e = l(t, i, r),
						n = o[e];
					null == n && (o[e] = n = a.length, a[n] = [e, []]), a[n][1].push(t)
				}), a
			}
		},
		groupData: function(t) {
			var e = this.that,
				n = e.options.groupModel,
				i = this.getVal(n.ignoreCase),
				r = n.dataIndx,
				o = e.pdata,
				a = e.columns;
			this.setSumCols(r);
			e.pdata = this.flattenG(a, this.group(i), n, function() {})(o), e._trigger("before" + (t ? "Pivot" : "Group") + "Summary"), this.summaryT()
		},
		hideRows: function(t, e, n, i) {
			for (var r, o = this.that.pdata, a = t, l = o.length; a < l; a++)
				if ((r = o[a]).pq_gsummary) n || i ? r.pq_level >= e && (r.pq_hidden = !0) : r.pq_level > e && (r.pq_hidden = !0);
				else if (r.pq_gtitle) {
				if (r.pq_level <= e) break;
				r.pq_hidden = !0
			} else r.pq_hidden = !0
		},
		init: function() {
			var t, e, n = this;
			n.onCMInit(), n._init || (n.mc = [], n.summaryData = [], t = (e = n.that).options.groupModel, n.groupRemoveIcon = "pq-group-remove ui-icon ui-icon-close", n.toggleIcon = "pq-group-toggle ui-icon ", e.on("cellClick", n.onCellClick(n)).on("cellKeyDown", n.onCellKeyDown2(n, t)).on(!0, "cellMouseDown", n.onCellMouseDown()).on("change", n.onChange(n, t)).on("dataReady", n.onDataReady.bind(n)).on("beforeFilterDone", function() {
				n.saveState()
			}).on("columnDragDone", n.onColumnDrag(n)).on("colMove", n.onColMove.bind(n)).on("customSort cancelSort", n.onCustomSort.bind(n)).on("valChange", n.onCheckbox(n, t)).on("refresh refreshRow", n.onRefresh(n, t)).on("refreshHeader", n.onRefreshHeader.bind(n)), (t.titleIndx || t.titleInFirstCol) && e.on("CMInit", n.onCMInit.bind(n)), e.on("beforeCheck", n.onBeforeCheck.bind(n)), n.setCascadeInit(!0), n._init = !0)
		},
		initHeadSortable: function() {
			var t = this.that,
				e = this.$header,
				t = t.options;
			e.sortable({
				axis: "x",
				distance: 3,
				tolerance: "pointer",
				cancel: ".pq-group-menu",
				stop: this.onSortable(this, t)
			})
		},
		initHeadDroppable: function() {
			var e = this,
				n = e.that,
				t = e.$header;
			t && (t.droppable({
				accept: function(t) {
					t = +t.attr("pq-col-indx");
					if (!isNaN(t) && n.colModel[t]) return e.acceptDrop
				},
				tolerance: "pointer",
				hoverClass: "pq-drop-hover",
				drop: e.onDrop(n, e)
			}), e.acceptDrop = !0)
		},
		initHeader: function(t, e) {
			var n, i;
			this.$header && (i = (n = this.$header).find(".pq-group-item"), n.data("uiSortable") || this.initHeadSortable(), i.length || n.append("<span class='pq-group-placeholder'>" + t.strGroup_header + "</span>"), e.headerMenu && this.initHeaderMenu())
		},
		initHeaderMenu: function() {
			for (var t, n = this, i = n.that.options, e = n.$header, r = ["<ul class='pq-group-menu'><li>", "<div><span>&nbsp;</span></div>", "<ul>"], o = i.groupModel, a = o.menuItems, l = 0, s = a.length; l < s; l++) t = a[l], r.push("<li data-option='", t, "' class='pq-menu-item'>", "<label>", "<input type='checkbox' ", o[t] ? "checked" : "", "/>", i["strGroup_" + t], "</label></li>");
			r.push("</ul></li></ul>"), (e = f(r.join("")).appendTo(e)).menu({
				icons: {
					submenu: "ui-icon-gear"
				},
				position: {
					my: "right top",
					at: "left top"
				}
			}), e.change(function(t) {
				var e;
				"INPUT" == t.target.nodeName && ((e = {})[t = f(t.target).closest("li").data("option")] = !i.groupModel[t], n.option(e))
			})
		},
		isOn: function() {
			var t = this.that.options.groupModel;
			return t.on && (t.dataIndx || []).length
		},
		getRC: function(t) {
			var e = 1,
				n = this;
			return (t[n.childstr] || []).forEach(function(t) {
				e += n.getRC(t)
			}), e + (t.pq_child_sum ? 1 : 0)
		},
		initmerge: function() {
			var n, i = this,
				e = i.that,
				t = e.options,
				r = t.groupModel,
				o = r.merge,
				a = r.summaryInTitleRow,
				l = r.titleIndx,
				s = e.colModel.length,
				d = [],
				c = r.dataIndx,
				u = (c.length, e.pdata || []);
			r.on && (o ? c.forEach(function(t, e) {
				u.forEach(function(t) {
					t.pq_gtitle && e == t.pq_level && (n = i.getRC(t), d.push({
						r1: t.pq_ri,
						rc: n,
						c1: e,
						cc: 1
					}))
				})
			}) : c.length && u.forEach(function(t) {
				!t.pq_gtitle || a && (t.pq_close || "collapsed" !== a) || d.push({
					r1: t.pq_ri,
					rc: 1,
					c1: l ? e.colIndxs[l] : t.pq_level,
					cc: s
				})
			})), d.length ? (i.mc = t.mergeCells = d, e.iMerge.init()) : i.mc.length && (i.mc.length = 0, e.iMerge.init())
		},
		initcollapsed: function() {
			var t, e, n, i, r, o = this.that,
				a = o.options.groupModel,
				l = a.merge,
				s = a.summaryInTitleRow,
				d = this.nodeClose,
				c = o.pdata,
				u = this.id;
			if (c) {
				for (var h = 0, f = c.length; h < f; h++)(n = c[h]).pq_gtitle && (i = n.pq_level, r = null, d && null != (e = d[t = n[u]]) && (delete d[t], r = n.pq_close = e), (r = null == r ? n.pq_close : r) ? this.hideRows(h + 1, i, l, s) : l && (n.pq_hidden = !0));
				o._trigger("groupHideRows")
			}
		},
		updateItems: function(t) {
			var e, n, i = this,
				r = 0,
				o = i.childstr;
			return (t || i.that.pdata).forEach(function(t) {
				t.pq_gtitle && (e = t[o], (n = e.length) && e[0][o] ? t.pq_items = i.updateItems(e) : t.pq_items = n, r += t.pq_items)
			}), r
		},
		removeEmptyParent: function(t) {
			var e, n = this.that.pdata,
				i = this.childstr;
			t[i].length || (n = (i = (e = this.getParent(t)) ? e[i] : n).indexOf(t), i.splice(n, 1), e && this.removeEmptyParent(e))
		},
		addNodes: function(t, e, n) {
			this.moveNodes(t, e, n, !0)
		},
		deleteNodes: function(t) {
			this.moveNodes(t, null, null, null, !0)
		},
		moveNodes: function(t, n, e, i, r) {
			var o, a, l, s, d = this,
				c = d.that,
				u = d.childstr,
				h = c.options,
				f = h.groupModel,
				p = f.dataIndx,
				g = d.getRoots(),
				m = n ? n[u] : g,
				v = [],
				w = d.parentId,
				x = d.getUniqueNodes(t),
				y = 0,
				C = m[0],
				b = m.length;
			if (e = null == e || b <= e ? b : e, l = x.length) {
				for (c._trigger("beforeMoveNode"); y < l; y++) s = x[y], i ? m.splice(e++, 0, s) : (a = (o = (o = d.getParent(s)) ? o[u] : g).indexOf(s), r ? o.splice(a, 1) : o == m ? e = pq.moveItem(s, m, a, e) : (m.splice(e++, 0, s), o.splice(a, 1))), n && o != m && (p.slice(0, n.pq_level + 1).forEach(function(e) {
					d.isFolder(s) ? d.getChildrenAll(s).forEach(function(t) {
						t[e] = n[e]
					}) : s[e] = C[e]
				}), s[w] = C[w], s.pq_hidden = C.pq_hidden);
				m == g && (c.pdata = m), c.iRefresh.addRT(x), d.updateItems(), d.summaryT(), c.pageData().forEach(function(t) {
					t.pq_gtitle || t.pq_gsummary || v.push(t)
				}), h.dataModel.data = v, d.isCascade(f) && (d.cascadeInit(), d.setValCBox()), c.iRefresh.addRowIndx(), d.initmerge(), c._trigger((i ? "add" : r ? "delete" : "move") + "Node", null, {
					args: arguments
				}), c.refresh({
					header: !1
				})
			}
		},
		onCellClick: function(i) {
			return function(t, e) {
				var n;
				e.rowData.pq_gtitle && f(t.originalEvent.target).hasClass("pq-group-icon") && (pq.isCtrl(t) ? (n = e.rowData, i[n.pq_close ? "expand" : "collapse"](n.pq_level)) : i.toggleRow(e.rowIndxPage, t))
			}
		},
		onCellMouseDown: function() {
			return function(t, e) {
				e.rowData.pq_gtitle && f(t.originalEvent.target).hasClass("pq-group-icon") && t.preventDefault()
			}
		},
		onCellKeyDown2: function(n, i) {
			return function(t, e) {
				return 0 != n.onCellKeyDown(t, e) && (e.rowData.pq_gtitle && 0 <= f.inArray(e.dataIndx, i.dataIndx) && t.keyCode == f.ui.keyCode.ENTER ? (n.toggleRow(e.rowIndxPage, t), !1) : void 0)
			}
		},
		onChange: function(n, i) {
			return function(t, e) {
				i.source != e.source && "checkbox" != e.source && (n.summaryT(), n.that.refresh())
			}
		},
		onColumnDrag: function(i) {
			return function(t, e) {
				var e = e.column,
					n = e.colModel;
				n && n.length || !1 === e.groupable || e.denyGroup ? i.acceptDrop = !1 : i.initHeadDroppable()
			}
		},
		onCustomSort: function(t, o) {
			var e, a = this.that,
				n = a.options,
				l = [],
				s = n.groupModel,
				d = s.dataIndx,
				i = o.sorter || [],
				c = i.map(function(t) {
					return t.dataIndx
				}),
				u = c[0],
				r = a.columns[u],
				h = d.indexOf(u);
			if ("remote" != n.sortModel.type && (s.on && d.length && !(0 <= h && r.groupChange))) return "pq_order" == u || "pq_gorder" == u || 0 == i.length || (r.summary || {}).type ? this._delaySort(o) : (e = d.map(function(t) {
				var e = c.indexOf(t);
				return {
					dataIndx: t,
					dir: (0 <= e ? i[e] : i[0]).dir
				}
			}).concat(i), e = pq.arrayUnique(e, "dataIndx"), this._delaySort(o, function(i) {
				function r() {
					l.length && o.sort_composite.push(a.iSort.compileSorter(l, i)), l = []
				}
				o.sort_composite = [], s.titleIndx == u ? e.forEach(function(t) {
					-1 == d.indexOf(t.dataIndx) ? l.push(t) : (r(), o.sort_composite.push(a.iSort.compileSorter([t], i)))
				}) : e.forEach(function(t) {
					var e = 0 <= c.indexOf(t.dataIndx),
						n = 0 <= d.indexOf(t.dataIndx);
					e ? n ? (r(), o.sort_composite.push(a.iSort.compileSorter([t], i))) : l.push(t) : (r(), o.sort_composite.push(void 0))
				}), r()
			}))
		},
		_delaySort: function(t, e) {
			var n = this,
				i = n.that,
				r = i.pdata;
			if (r && r.length) return i.one("isSkipGroup", function() {
				return e && e(r), t.data = r, n.onCustomSortTree({}, t), i.pdata = t.data, n.summaryRestore(), !1
			}), !1
		},
		summaryRestore: function() {
			var r, o = this.childstr;
			this.that.pdata = function e(t, n) {
				var i = [];
				return t.forEach(function(t) {
					i.push(t), e(t[o] || [], t).forEach(function(t) {
						i.push(t)
					})
				}), n && (r = n.pq_child_sum) && !r.pq_ghidden && i.push(r), i
			}(this.getRoots())
		},
		onDrop: function(n, i) {
			return function(t, e) {
				e = +e.draggable.attr("pq-col-indx"), e = n.colModel[e].dataIndx;
				i.addGroup(e), i.acceptDrop = !1
			}
		},
		onSortable: function(t, e) {
			return function() {
				var n, i, r = [],
					o = e.groupModel.dataIndx;
				f(this).find(".pq-group-item").each(function(t, e) {
					i = f(e), i = i.data("indx"), o[t] !== i && (n = !0), r.push(i)
				}), n && t.option({
					dataIndx: r
				}, "", "", function() {
					t.triggerChange()
				})
			}
		},
		onDataReady: function(t, e) {
			var n = this,
				i = n.that,
				r = i.iSort,
				o = i.options.groupModel,
				a = o.dataIndx.length;
			0 != e.group && (o.on && (a || o.grandSummary ? (!1 !== i._trigger("isSkipGroup") && (r.saveOrder(), n.groupData(), r.saveOrder("pq_gorder"), n.buildCache()), i.iRefresh.addRowIndx(), n.refreshColumns(), a && (n.initcollapsed(), n.initmerge(), n.isCascade(o) && n.cascadeInit())) : n.refreshColumns(), n.setValCBox()), n.createHeader())
		},
		onColMove: function() {
			var t = this.that.options.groupModel;
			if (t.titleInFirstCol) return this.that.refreshView(), !1;
			t.titleIndx || this.initmerge()
		},
		option: function(t, e, n, i) {
			var r = t.dataIndx,
				o = this.that,
				r = r ? r.length : 0,
				a = o.options.groupModel,
				n = {
					source: n,
					oldGM: f.extend({}, a),
					ui: t
				},
				l = a.dataIndx;
			0 != o._trigger("beforeGroupOption", null, n) && (t.agg && this.updateAgg(t.agg, a.agg), a.on && l.length && (!1 === t.on || 0 === r) && this.showRows(), f.extend(a, t), i && i(), this.init(), this.setOption(), o._trigger("groupOption", null, n), !1 !== e && (o.refreshView({
				refresh: !1
			}), o.sort({
				header: !1
			})))
		},
		showRows: function() {
			this.that.options.dataModel.data.forEach(function(t) {
				t.pq_hidden && (t.pq_hidden = void 0)
			})
		},
		renderBodyCell: function(t, r) {
			var o, a = this,
				l = r.checkbox,
				e = r.dataIndx.length - (a.isPivot() ? 1 : 0),
				s = r.titleIndx,
				n = s ? r.indent : 0,
				d = n * e,
				c = "";
			return e && (d += n),
				function(t) {
					var e = t.rowData,
						n = t.column,
						i = n.renderLabel;
					if (!t.Export) return i = i && i.call(a.that, t) || t.formatVal || t.cellData, {
						text: ((t = (c = l && s && (o = a.renderCB(l, e, r.cbId)) ? o[0] : c) && (n.useLabel || r.useLabel)) ? "<label>" : "") + c + (null == i ? "" : i) + (t ? "</label>" : ""),
						style: "text-indent:" + d + "px;"
					}
				}
		},
		renderCell: function(t, r) {
			var o = this.renderTitle(t, r),
				a = this.renderBodyCell(t, r),
				l = this.renderSummary(t);
			return function(t, i) {
				t._renderG = function(t) {
					var e = t.rowData,
						n = e.pq_gtitle;
					return i && n ? o(t) : n || e.pq_gsummary ? l(t) : r.titleIndx == t.dataIndx ? a(t) : void 0
				}
			}
		},
		renderSummary: function(r) {
			var o = this.that,
				a = r.groupModel.dataIndx;
			return function(t) {
				var e = t.rowData,
					n = t.column,
					i = n.summary;
				if (i && (e = i[a[e.pq_level]] || i.type)) return "function" == typeof(i = r.summaryTitle[e]) ? i.call(o, t) : ("number" != typeof(e = null == (e = t.formatVal) ? null == (e = t.cellData) ? "" : e : e) || n.format || parseInt(e) === e || (e = e.toFixed(2)), i ? i.replace("{0}", e) : e)
			}
		},
		updateformatVal: function(t, e, n) {
			t = t.dataIndx[n], n = this.that.columns[t];
			n && n.format && n != e.column && (e.formatVal = pq.format(n, e.cellData))
		},
		renderTitle: function(t, l) {
			var s, d, c = this,
				u = c.that,
				h = t.rtl,
				f = l.checkbox,
				p = ["pq-group-title-cell"],
				g = l.titleIndx,
				m = l.indent,
				t = l.icon,
				v = ["ui-icon " + t[0], "ui-icon " + t[1]];
			return function(t) {
				var e, n, i, r = t.rowData,
					o = t.column,
					a = o.useLabel;
				if (null != t.cellData) return r.children.length, e = r.pq_close, n = r.pq_level, i = l.title, c.updateformatVal(l, t, n), i = null == (i = "function" == typeof(i = o.renderLabel || i[n] || l.titleDefault) ? i.call(u, t) : i.replace("{0}", t.formatVal || t.cellData).replace("{1}", r.pq_items)) ? t.formatVal || t.cellData : i, o = "pq-group-icon " + v[e ? 1 : 0], t.Export ? i : (f && g && c.isCascade(l) && (s = c.renderCB(f, r, l.cbId)) && (d = s[0], s[1] && p.push(s[1])), {
					text: [(a = d && (null != a ? a : l.useLabel)) ? "<label>" : "", "<span class='", o, "'></span>", d, i, a ? "</label>" : ""].join(""),
					cls: p.join(" "),
					style: "text-align:" + (h ? "right" : "left") + ";text-indent:" + m * n + "px;"
				})
			}
		},
		triggerChange: function() {
			this.that._trigger("groupChange")
		},
		removeGroup: function(e) {
			var t = this;
			t.option({
				dataIndx: t.that.options.groupModel.dataIndx.filter(function(t) {
					return t != e
				})
			}, "", "", function() {
				t.triggerChange()
			})
		},
		refreshColumns: function() {
			for (var t, e, n, i = this.that, r = i.options, o = r.groupModel, a = o.on, l = o.fixCols, s = this.renderCell(r, o), d = i.columns, c = o.dataIndx, u = c.length, h = i.colModel, f = h.length; f--;)(t = h[f])._renderG && delete t._renderG, t._nodrag && (delete t._nodrag, delete t._nodrop), a && (e = t.summary) && e.type && s(t);
			if (r.editor = a ? this.editorSummary(r, o) : this.oldEditor, a)
				if (o.titleIndx) s(t = d[o.titleIndx], !0);
				else {
					for (f = u - 1; 0 <= f; f--) s(t = d[c[f]], !0);
					if (l && !o.titleInFirstCol)
						for (f = 0; f < u; f++)(t = h[n = i.getColIndx({
							dataIndx: c[f]
						})])._nodrag = t._nodrop = !0, n != f && (i.iDragColumns.moveColumn(n, f, !0), i.refreshCM(null, {
							group: !0
						}))
				}
		},
		saveState: function() {
			var t = this.nodeClose = this.nodeClose || {};
			this.fillState(t)
		},
		setSumCols: function(n) {
			var i = [],
				r = [];
			return n = pq.objectify(n), this.that.colModel.forEach(function(t) {
				var e = t.summary;
				e && e.type && (e = t.dataIndx, n[e] || (i.push(t), r.push(e)))
			}), this._sumCols = i, this._sumDIs = r, [i, r]
		},
		setOption: function() {
			this._init && (this.refreshColumns(), this.summaryData.length = 0, this.initmerge())
		},
		softRefresh: function() {
			var t = this.that;
			this.pdata = null, t.pdata.forEach(function(t) {
				delete t.pq_hidden
			}), this.initcollapsed(), this.initmerge(), t.refresh({
				header: !1
			})
		},
		toggleLevel: function(t, e) {
			var n = this.that.options.groupModel,
				i = n.collapsed,
				t = f.inArray(t, n.dataIndx),
				n = pq.isCtrl(e) ? "All" : "";
			this[(i[t] ? "expand" : "collapse") + n](t)
		},
		trigger: function(t) {
			var e, n, i, r = t.evt,
				o = t.rd,
				a = t.level,
				l = t.all,
				s = t.close,
				t = this.that,
				d = t.options.groupModel,
				c = d.dataIndx,
				u = d.collapsed,
				d = p.beforeTrigger(r, t),
				r = {};
			if (o) {
				if (n = o[c[e = o.pq_level]], d(r = {
						level: e,
						close: s = !o.pq_close,
						group: n
					})) return !1;
				o.pq_close = s
			} else if (l) {
				if (d(r = {
						all: !0,
						close: s,
						level: a
					})) return !1;
				for (i = a; i < c.length; i++) u[i] = s
			} else if (null != a) {
				if (d(r = {
						level: a,
						close: s
					})) return !1;
				u[a] = s
			}
			return t._trigger("group", null, r)
		},
		toggleRow: function(t, e) {
			t = this.that.pdata[t];
			!1 !== this.trigger({
				evt: e,
				rd: t
			}) && this.softRefresh()
		}
	}), t.pqGrid.prototype.Group = function(t) {
		var e = this.iGroup;
		if (null == t) return e;
		e.expandTo(t.indx)
	}
}(jQuery), ! function(l) {
	var t = l.paramquery,
		e = t.pqGrid.prototype,
		n = e.options,
		i = (l(document).on("pqGrid:bootup", function(t, e) {
			e = e.instance;
			e.iDrag = new i(e)
		}), t.cDrag = function(t) {
			var e = this,
				n = t.options,
				i = e.rtl = n.rtl,
				r = n.dragModel;
			r.on && (e.that = t, n.postRenderInterval = n.postRenderInterval || -1, e.model = r, e.ns = ".pq-drag", r.tmplDragN = e.rtlfy(i, r.tmplDragN), r.tmplDrag = e.rtlfy(i, r.tmplDrag), t.on("CMInit", e.onCMInit.bind(e)).on("create", e.onCreate.bind(e)))
		});
	e.Drag = function() {
		return this.iDrag
	}, n.dragModel = {
		afterDrop: function() {},
		beforeDrop: function(t, e) {
			var n = this.Drag(),
				i = n.getUI().nodes,
				r = this,
				o = this.Tree(),
				a = this.Group();
			o.isOn() ? r = o : a.isOn() && (r = a), n.clean(), r.deleteNodes(i)
		},
		diDrag: -1,
		dragNodes: function(t) {
			return [t]
		},
		contentHelper: function(t, e) {
			var n = e[0],
				e = e.length;
			return t.map(function(t) {
				return n[t]
			}).join(", ") + (1 < e ? " ( " + e + " )" : "")
		},
		clsHandle: "pq-drag-handle",
		clsDnD: "pq-dnd",
		clsNode: "pq-dnd-drag",
		iconAccept: "ui-icon ui-icon-check",
		iconReject: "ui-icon ui-icon-cancel",
		tmplDragN: "<span class='ui-icon ui-icon-grip-dotted-vertical pq-drag-handle' style='cursor:move;position:absolute;left:2px;top:4px;'>&nbsp;</span>",
		tmplDrag: "<span class='ui-icon ui-icon-grip-dotted-vertical pq-drag-handle' style='cursor:move;vertical-align:text-bottom;touch-action:none;'>&nbsp;</span>",
		cssHelper: {
			opacity: .7,
			position: "absolute",
			height: 25,
			width: 200,
			overflow: "hidden",
			background: "#fff",
			border: "1px solid",
			boxShadow: "4px 4px 2px #aaaaaa",
			zIndex: 1001
		},
		tmplHelper: "<div class='pq-border-0 pq-grid-cell' style='pointer-events: none;'><span class='pq-icon' style='vertical-align:text-bottom;margin:0 5px;'></span><span></span></div>"
	}, i.prototype = {
		addIcon: function(t) {
			this.$helper.find(".pq-icon").attr("class", "").addClass("pq-icon " + t)
		},
		addAcceptIcon: function() {
			this.addIcon(this.model.iconAccept)
		},
		addRejectIcon: function() {
			this.addIcon(this.model.iconReject)
		},
		getHelper: function(t) {
			var e = this.that,
				n = this.model,
				i = n.clsNode,
				r = l(t.target).closest(".pq-grid-cell,.pq-grid-number-cell"),
				r = this.cellObj = e.getCellIndices({
					$td: r
				}),
				o = n.diHelper || [n.diDrag],
				a = r.rowData,
				r = r.nodes = n.dragNodes.call(e, a, t),
				a = n.contentHelper.call(e, o, r),
				t = this.$helper = l(n.tmplHelper);
			return t.find("span:eq(1)").html(a), r.forEach(function(t) {
				e.addClass({
					rowData: t,
					cls: i
				})
			}), this.addRejectIcon(), t.addClass("pq-theme pq-drag-helper").css(n.cssHelper).data("Drag", this), t[0]
		},
		getUI: function() {
			return this.cellObj
		},
		grid: function() {
			return this.that
		},
		isSingle: function() {
			return 1 == this.getData().length
		},
		getTextNodesIn: function(t) {
			return l(t).find(":not(iframe)").addBack().contents().filter(function() {
				return 3 == this.nodeType && l.trim(this.nodeValue).length
			})[0]
		},
		onCMInit: function() {
			var e = this,
				n = e.that,
				t = e.model,
				i = t.isDraggable,
				r = n.columns[t.diDrag],
				o = r ? t.tmplDrag : t.tmplDragN;
			(r || n.options.numberCell).postRender = function(t) {
				i && !i.call(n, t) || l(o).insertBefore(e.getTextNodesIn(t.cell))
			}
		},
		onCreate: function() {
			var t = this,
				e = t.model,
				n = {
					top: 20
				},
				i = -1 == e.diDrag;
			t.that.on(!0, "cellMouseDown", t.onCellMouseDown.bind(t)), n[t.rtl ? "right" : "left"] = 2, t.ele = t.that.$cont.children(":first").addClass(e.clsDnD + (i ? " pq-drag-number" : "")).draggable(l.extend({
				cursorAt: n,
				containment: "document",
				appendTo: "body"
			}, e.options, {
				handle: "." + e.clsHandle,
				helper: t.getHelper.bind(t),
				revert: t.revert.bind(t)
			}))
		},
		onDrop: function(t, e, n) {
			this.model[t].call(this.that, e, n)
		},
		clean: function() {
			var e = this;
			e.getUI().nodes.forEach(function(t) {
				e.that.removeClass({
					rowData: t,
					cls: e.model.clsNode
				})
			})
		},
		revert: function(t) {
			this.clean(), t || this.$helper.hide("explode", function() {
				l(this).remove()
			})
		},
		rtlfy: function(t, e) {
			var n = {
				left: "right",
				right: "left"
			};
			return t ? e.replace(/left|right/g, function(t) {
				return n[t]
			}) : e
		},
		onCellMouseDown: function(t) {
			var e = this.model;
			l(t.originalEvent.target).closest("." + e.clsHandle).length && t.preventDefault()
		},
		over: function(t, e) {
			this.addAcceptIcon()
		},
		out: function(t, e) {
			this.addRejectIcon()
		}
	}
}(jQuery), ! function(o) {
	var t = o.paramquery,
		e = t.pqGrid.prototype,
		n = e.options,
		i = (o(document).on("pqGrid:bootup", function(t, e) {
			e = e.instance;
			e.iDrop = new i(e)
		}), e.Drop = function() {
			return this.iDrop
		}, n.dropModel = {
			accept: ".pq-dnd",
			clsParent: "pq-dnd-parent",
			drop: function(t, e) {
				function n(t, e) {
					var n, i, r;
					(c || e) && (e = l.iDrop.parent, (r = (i = t.getChildren(e)).length) && (n = c ? c == e ? u ? null : 0 : i.indexOf(c) + (u ? 0 : 1) : r), o ? t.moveNodes(a, e, n) : t.addNodes(a, e, n))
				}
				var i, o, a, r = e.helper.data("Drag"),
					l = this,
					s = l.Group(),
					d = l.Tree(),
					c = e.rowData,
					u = e.ratioY() <= .5,
					e = null == (e = e.rowIndx) ? e : e + (u ? 0 : 1);
				r && (i = r.getUI(), o = r.grid() == l, a = i.nodes, s.isOn() ? n(s) : d.isOn() ? n(d, !0) : o ? l.moveNodes(a, e) : l.addNodes(a, e))
			},
			getParent: function(t, e) {
				var n, i, r = e.rowData,
					o = this.options,
					a = o.dropModel.divider,
					l = this.Group(),
					s = l.isOn(),
					d = this.Tree(),
					c = d.isOn();
				if (r) return c ? i = a ? (n = (c = this.widget()).offset().left, i = (e = e.helper).offset().left, (o.rtl ? n + c.width() - i - e.width() > a : a < i - n) ? r : d.getParent(r)) : d.getParent(r) : s && (i = l.getParent(r)), i
			}
		}, t.cDrop = function(t) {
			var e = t.options,
				n = e.dropModel;
			(this.model = n).on && (this.that = t, this.rtl = e.rtl, this.ns = ".pq-drop", t.on("create", this.onCreate.bind(this)))
		});
	i.prototype = {
		addUI: function(t, e, n) {
			var i = this;
			t.$cell = n, t.ratioY = function() {
				return i.ratioY(e, n)
			}, o.extend(t, i.that.getCellIndices({
				$td: n
			}))
		},
		callFn: function(t, e, n) {
			t = this.model[t];
			if (t) return t.call(this.that, e, n)
		},
		feedback: function(t, e) {
			var n, i, r;
			e.length && (n = (r = this.getCellY(e))[0], i = this.that.$cont, t = this.ratioY(t, e), e = i.offset().left, r = r[1], this.$feedback = this.$feedback || this.newF(), this.$feedback.css({
				top: t <= .5 ? n - 1 : r - 1,
				left: e,
				width: i[0].clientWidth,
				zIndex: 1e4
			}), i.css("cursor", "copy"))
		},
		getCell: function(t) {
			return t.closest(".pq-grid-cell,.pq-grid-number-cell")
		},
		getCellY: function(t) {
			var e = t.offset().top;
			return [e, e + t[0].offsetHeight]
		},
		getDrag: function(t) {
			return t.helper.data("Drag")
		},
		isOn: function() {
			return this.model.on
		},
		isOver: function() {},
		newF: function() {
			return o("<svg class='pq-border-0' style='box-sizing:border-box;position:absolute;border-width:1.5px;border-style:dashed;pointer-events:none;height:0;'></svg>").appendTo(document.body)
		},
		onCreate: function() {
			this.that.$cont.droppable(o.extend({
				tolerance: "pointer"
			}, this.model.options, {
				accept: this.model.accept,
				over: this.onOver.bind(this),
				out: this.onOut.bind(this),
				drop: this.onDrop.bind(this)
			}))
		},
		onOver: function(t, e) {
			var n = this,
				i = n.model.divider,
				r = n.Drag = n.getDrag(e);
			e.draggable.on("drag.pq", n.onDrag.bind(n)), i && (n.$left = o("<svg class='pq-border-0' style='position:absolute;width:0;height:100%;" + (n.rtl ? "right:" : "left:") + i + "px;top:0;border-style:dashed;border-width:1.5px;pointer-events:none;'></svg>").appendTo(n.that.$cont)), r && r.over(t, e), n.isOver = function() {
				return !0
			}, n.callFn("over", t, e)
		},
		onOut: function(t, e) {
			e.draggable.off("drag.pq"), this.removeFeedback();
			var n = this.getDrag(e),
				i = this.$left;
			i && i.remove(), n && n.out(t, e), this.isOver = function() {}, this.callFn("out", t, e)
		},
		setParent: function(t) {
			var e = this.that,
				n = this.model.clsParent,
				i = this.parent;
			i != t && (i && e.removeClass({
				rowData: i,
				cls: n
			}), t && e.addClass({
				rowData: t,
				cls: n
			})), this.parent = t
		},
		setDeny: function(t, e, n) {
			var i = this.Drag;
			this.denyDrop = !1 === this.callFn("isDroppable", t, e), this.denyDrop ? (i && i.out(), this.removeFeedback()) : (i && i.over(), this.feedback(t, n), this.setParent(this.callFn("getParent", t, e)))
		},
		onDrag: function(t, e) {
			var n = pq.elementFromXY(t),
				i = this.getCell(n);
			(i.length || this.that.$cont[0].contains(n[0])) && (this.addUI(e, t, i), this.setDeny(t, e, i))
		},
		onDropX: function(e, n) {
			function t(t) {
				if (o && o.grid() != i) o.onDrop(t, e, n);
				else try {
					r.draggable("instance").options[t].call(r[0], e, n)
				} catch (t) {}
			}
			var i = this.that,
				r = n.draggable,
				o = n.helper.data("Drag");
			t("beforeDrop"), this.callFn("drop", e, n), this.setParent(), t("afterDrop")
		},
		onDrop: function(t, e) {
			var n, i = pq.elementFromXY(t);
			this.onOut(t, e), this.denyDrop || ((n = this.getCell(i)).length || this.that.$cont[0].contains(i[0])) && (this.addUI(e, t, n), this.onDropX(t, e))
		},
		onMouseout: function() {
			this.removeFeedback()
		},
		onMouseup: function() {
			this.removeFeedback(), o(document).off(this.ns), this.that.$cont.off(this.ns)
		},
		ratioY: function(t, e) {
			if (e.length) return (t.pageY - (e = (t = this.getCellY(e))[0])) / (t[1] - e)
		},
		removeFeedback: function() {
			var t = this;
			t.$feedback && (t.$feedback.remove(), t.$feedback = null), t.that.$cont.css("cursor", ""), requestAnimationFrame(function() {
				t.setParent()
			})
		}
	}
}(jQuery), ! function(d) {
	var t = d.paramquery,
		i = (t.pqGrid.defaults.contextMenu = {
			preInit: function(t) {
				if (pq.isCtrl(t)) return !1
			},
			init: function(t, e) {
				var n, i;
				e.$td && (n = {
					r1: e.rowIndx,
					c1: e.colIndx,
					rc: 1,
					cc: 1
				}, i = this.Selection(), this.options.selectionModel.native || -1 != i.indexOf(n) || (i.removeAll(), this.Range(n).select(), this.focus(e)))
			}
		}, d(document).on("pqGrid:bootup", function(t, e) {
			var n = e.instance;
			n.iContext = new i(n), n.Context = function() {
				return n.iContext
			}
		}), t.cContext = function(t) {
			var e = t.options;
			this.model = e.contextMenu, this.that = t, this.ns = ".pq-cmenu", this.rtl = e.rtl, t.on("context", this.onContext.bind(this)).on("destroy", this.removeMenu.bind(this))
		});
	i.prototype = {
		createMenu: function(n) {
			n = n.filter(function(t) {
				return null != t
			});
			var t, i = this,
				r = "";
			return n.forEach(function(t, e) {
				r += i.getItemHtml(t, e)
			}), (t = d("<div dir='" + (i.rtl ? "rtl" : "ltr") + "' class='pq-cmenu pq-theme pq-popup'><table>" + r + "</table></div>").appendTo(document.body)).find(".pq-cmenu-item").each(function(t, e) {
				d(e).data("item", n[t])
			}), t.on("mouseover", i.onMouseOver.bind(i)).on("remove", i.onRemove(i)).on("mousedown", function(t) {
				t.preventDefault()
			}), t
		},
		get$Item: function(t) {
			return d(t.target).closest(".pq-cmenu-item")
		},
		getItem: function(t) {
			return this.get$Item(t).data("item")
		},
		getItemHtml: function(t, e) {
			var n, i;
			return "separator" == t ? "<tr class='pq-cmenu-item'><td colspan=4 class='pq-bg-2' style='height:1px;padding:0;'></td></td>" : (n = t.style, i = t.tooltip, "<tr class='pq-cmenu-item " + (t.disabled ? "pq_disabled" : "") + " " + (t.cls || "") + "' indx=" + e + "><td><span class='" + (t.icon || "") + "' /></td><td " + (n ? 'style="' + n + '"' : "") + " " + (i ? 'title="' + i + '"' : "") + ">" + t.name + "</td><td>" + (t.shortcut || "") + "</td><td><span class='" + (t.subItems ? "pq-submenu ui-icon ui-icon-triangle-1-" + (this.rtl ? "w" : "e") : "") + "' /></td></tr>")
		},
		onContext: function(t, e) {
			if (this.model.on) return this.showMenu(t, e)
		},
		onRemove: function(t) {
			return function() {
				d(this).find(".pq-cmenu-item").each(t.removeSubMenu)
			}
		},
		onMouseDown: function(t) {
			this.getItem(t) || this.removeMenu()
		},
		onclickDoc: function(t) {
			var e, n = this.getItem(t);
			n && !n.disabled && (e = n.action) && !1 !== e.call(this.that, t, this.ui, n) && this.removeMenu()
		},
		onMouseOver: function(t) {
			var e = this.rtl,
				n = this.getItem(t),
				t = this.get$Item(t),
				n = (n || {}).subItems;
			t.siblings().each(this.removeSubMenu), n && n.length && !t[0].subMenu && ((n = this.createMenu(n)).position({
				my: e ? "right top" : "left top",
				at: e ? "left top" : "right top",
				of: t,
				collision: "flipfit"
			}), t[0].subMenu = n)
		},
		removeMenu: function() {
			this.$menu && (this.$menu.remove(), delete this.$menu, d(document.body).off(this.ns))
		},
		removeSubMenu: function(t, e) {
			var n = "subMenu";
			e[n] && (e[n].remove(), delete e[n])
		},
		showMenu: function(t, e) {
			var n = this,
				i = n.rtl,
				r = n.model,
				o = n.ns,
				a = n.that,
				l = n.$menu,
				s = e.type,
				s = r[s + "Items"] || (s ? r.items : r.miscItems),
				s = pq.isFn(s) ? s.call(a, t, e) : s;
			if (l && n.removeMenu(), s && s.length && !1 !== r.preInit.call(a, t, e)) return r.init.call(a, t, e), n.ui = e, (l = n.$menu = n.createMenu(s)).position({
				my: (i ? "right" : "left") + " top",
				at: e.at,
				my: e.my,
				of: t,
				collision: "fit"
			}), d(document.body).on("click" + o, n.onclickDoc.bind(n)).on("mousedown" + o + " touchstart" + o, n.onMouseDown.bind(n)), !1
		}
	}
}(jQuery), ! function(d) {
	d(document).on("pqGrid:bootup", function(t, e) {
		e = e.instance;
		e.iAnim = new n(e)
	});
	var t = d.paramquery,
		n = t.cAnim = function(t) {
			var e = this.model = t.options.animModel;
			this.grid = t, this.nodes = [], e.on && t.on(e.events, this.onBefore.bind(this))
		},
		e = t.pqGrid.prototype,
		i = e.options;
	e.Anim = function() {
		return this.iAnim
	}, i.animModel = {
		duration: 290,
		events: "beforeSortDone beforeFilterDone beforeRowExpandDone beforeGroupExpandDone beforeMoveNode beforeAutoRowHeight beforeValidateDone beforeTreeExpandDone onResizeHierarchy",
		eventsH: "beforeColAddDone beforeColRemoveDone beforeHideColsDone beforeColumnCollapseDone beforeColMoveDone beforeFlex columnResize"
	}, t.mixAnim = {
		cleanUp: function() {
			(this.data || []).forEach(function(t) {
				t.pq_top = t.pq_hideOld = void 0
			}), this.data = this.render = null
		},
		stop: function() {
			this.nodes.forEach(function(t) {
				t.stop()
			}), this.nodes = []
		}
	}, n.prototype = d.extend({
		isActive: function() {
			return this._active
		},
		onBefore: function(t, e) {
			if (!t.isDefaultPrevented() && !this.data) {
				var n, i = this,
					t = i.grid,
					r = t.iRenderB,
					o = i.data = r.data,
					a = i.render = [];
				try {
					i.htTbl = r.dims.htTbl, r.eachV(function(t, e) {
						n = r.get$Row(e), t.pq_render = 1, a.push([t, n.clone(), n.map(function(t, e) {
							return e.parentNode
						})])
					}), o.forEach(function(t, e) {
						t.pq_top = r.getTop(e), t.pq_hideOld = t.pq_hidden
					}), t.one("refresh", i.oneRefresh.bind(i)), setTimeout(function() {
						i.cleanUp()
					})
				} catch (t) {
					i.data = null
				}
			}
		},
		oneRefresh: function() {
			var o, a, l, t, e, n, s;
			this.data && (a = (o = this).grid.iRenderB, l = o.model.duration, t = d([a.$tbl_left[0], a.$tbl_right[0]]), e = o.htTbl, n = a.dims.htTbl, o.stop(), o._active = !0, n < e && t.css("height", e), setTimeout(function() {
				t.css("height", a.dims.htTbl), o._active = !1
			}, l), a.eachV(function(t, e) {
				delete t.pq_render;
				var n, i = a.getTop(e),
					r = t.pq_top;
				r == i && !t.pq_hideOld || (s = a.get$Row(e), e = null == r || t.pq_hideOld ? (n = {
					opacity: 0
				}, {
					opacity: 1
				}) : (n = {
					top: r
				}, {
					top: i
				}), s.css(n).animate(e, l), o.nodes.push(s))
			}), o.render.forEach(o.removeRows.bind(o)), o.cleanUp())
		},
		removeRows: function(n) {
			var t, e = n[0],
				i = e.pq_ri,
				r = this.model.duration,
				o = {
					opacity: 1,
					top: e.pq_top
				};
			if (e.pq_render) {
				if (delete e.pq_render, (t = n[1].each(function(t, e) {
						d(e).removeAttr("id").appendTo(n[2][t]).children().removeAttr("id")
					})).css(o), null == i || e.pq_hidden) o = {
					opacity: 0
				};
				else try {
					o = {
						top: this.grid.iRenderB.getTop(i)
					}
				} catch (t) {
					o = {
						opacity: 0
					}
				}
				t.animate(o, r, function() {
					this.parentNode && this.parentNode.removeChild(this)
				}), this.nodes.push(t)
			}
		}
	}, t.mixAnim)
}(jQuery), ! function(a) {
	a(document).on("pqGrid:bootup", function(t, e) {
		e = e.instance;
		e.iAnimH = new n(e)
	});
	var t = a.paramquery,
		n = t.cAnimH = function(t) {
			var e = t.options,
				n = this.model = e.animModel;
			this.grid = t, this.rtl = e.rtl ? "right" : "left", this.nodes = [], n.on && t.on(n.eventsH, this.onBeforeCol.bind(this))
		};
	t.pqGrid.prototype.AnimH = function() {
		return this.iAnimH
	}, n.prototype = a.extend({
		get$Col: function() {
			var t = this.grid,
				e = t.iRenderB,
				n = t.iRenderHead,
				i = t.iRenderSum,
				r = e.getAllCells(),
				o = n.getAllCells(),
				a = i.getAllCells();
			return function(t) {
				return e.get$Col(t, r).add(n.get$Col(t, o)).add(i.get$Col(t, a))
			}
		},
		onBeforeCol: function(t) {
			if (!t.isDefaultPrevented() && !this.data) {
				var n, t = this.grid,
					e = this.data = t.getColModel(),
					i = this.get$Col(),
					r = t.iRenderB,
					o = this.render = [];
				try {
					e.forEach(function(t, e) {
						t.pq_hideOld = t.hidden, t.pq_top = r.getLeft(e)
					})
				} catch (t) {
					return void this.cleanUp()
				}
				r.eachH(function(t, e) {
					n = i(e), t.pq_render = 1, o.push([t, n.clone(), n.map(function(t, e) {
						return e.parentNode.id
					})])
				}), t.one("softRefresh refresh", this.oneRefreshCol.bind(this))
			}
		},
		oneRefreshCol: function() {
			var s, d, c, u, h;
			this.data && (d = (s = this).grid.iRenderB, c = s.model.duration, u = s.get$Col(), s.stop(), d.eachH(function(t, e) {
				delete t.pq_render;
				var n = d.getLeft(e),
					i = t.pq_top,
					r = s.rtl,
					o = {
						opacity: 0
					},
					a = {
						opacity: 1
					},
					l = {};
				i == n && !t.pq_hideOld || (h = u(e), null == i ? h.css(o).animate(a, c) : t.pq_hideOld ? (o[r] = i, a[r] = n, h.css(o).animate(a, c)) : (l[r] = n, h.css(r, i).animate(l, c)), s.nodes.push(h))
			}), s.render.forEach(s.removeCols.bind(s)), s.cleanUp())
		},
		removeCols: function(n) {
			var t, e = n[0],
				i = this.model.duration,
				r = this.grid,
				o = r.iRenderB,
				r = r.colIndxs[e.dataIndx];
			e.pq_render && (delete e.pq_render, t = n[1].each(function(t, e) {
				a(e).removeAttr("id").appendTo(document.getElementById(n[2][t]))
			}), e = null == r || e.hidden ? (t.css("opacity", 1), {
				opacity: 0
			}) : {
				left: o.getLeft(r)
			}, t.animate(e, i, function() {
				this.parentNode && this.parentNode.removeChild(this)
			}), this.nodes.push(t))
		}
	}, t.mixAnim)
}(jQuery), ! function(h) {
	var t = h.paramquery,
		e = t.pqGrid.defaults,
		n = (h(document).on("pqGrid:bootup", function(t, e) {
			e = e.instance;
			e.iFillHandle = new n(e)
		}), e.autofill = !0, t.cFillHandle = function(t) {
			var e = this;
			e.$wrap, e.locked, e.sel, e.that = t, e.rtl = t.options.rtl, t.on("selectChange", e.onSelectChange(e)).on("selectEnd", e.onSelectEnd(e)).on("assignTblDims", e.onRefresh(e)).on("keyDown", e.onKeyDown.bind(e))
		});
	n.prototype = {
		getLT: function(t, e, n, i) {
			t -= e / 2;
			return Math.min(t + e, n["offset" + i]) - e
		},
		create: function() {
			var t, e, n, i = this.that;
			this.locked || (this.remove(), 1 === (n = i.Selection().address()).length && (e = (n = n[0]).r2, n = n.c2, t = "parentNode", e = i.iMerge.getRootCellO(e, n, !0), (n = i.getCell(e)).length && !1 !== i._trigger("beforeFillHandle", null, e) && (t = (n = n[0][t][t])[t], i = i.iRenderB.getCellCoords(e.rowIndxPage, e.colIndx), e = this.getLT(i[2], 10, n, "Width"), i = {
				position: "absolute",
				top: this.getLT(i[3], 10, n, "Height"),
				height: 10,
				width: 10,
				background: "#333",
				cursor: "crosshair",
				border: "2px solid #fff",
				zIndex: 1
			}, n = h("<div class='pq-fill-handle'></div>").appendTo(t), i[this.rtl ? "right" : "left"] = e, n.css(i), this.$wrap = n, this.setDraggable(), this.setDoubleClickable())))
		},
		onSelectChange: function(t) {
			return function() {
				t.remove()
			}
		},
		onSelectEnd: function(t) {
			return function() {
				this.options.fillHandle && t.create()
			}
		},
		onRefresh: function(t) {
			var e;
			return function() {
				this.options.fillHandle ? (clearTimeout(e), e = setTimeout(function() {
					t.that.element && t.create()
				}, 50)) : t.remove()
			}
		},
		remove: function() {
			var t = this.$wrap;
			t && t.remove()
		},
		setDoubleClickable: function() {
			var t = this.$wrap;
			t && t.on("dblclick", this.onDblClick(this.that, this))
		},
		setDraggable: function() {
			var t = this.$wrap,
				e = this.that.$cont;
			t && t.draggable({
				helper: function() {
					return "<div style='height:10px;width:10px;cursor:crosshair;'></div>"
				},
				appendTo: e,
				start: this.onStart.bind(this),
				drag: this.onDrag.bind(this),
				stop: this.onStop.bind(this)
			})
		},
		patternDate: function(n) {
			var i = this;
			return function(t) {
				var e = new Date(n);
				return e.setDate(e.getDate() + (t - 1)), i.formatDate(e)
			}
		},
		formatDate: function(t) {
			return t.getMonth() + 1 + "/" + t.getDate() + "/" + t.getFullYear()
		},
		patternDate2: function(n, t) {
			var e, i = new Date(n),
				t = new Date(t),
				r = this,
				o = t.getDate() - i.getDate(),
				a = t.getMonth() - i.getMonth(),
				l = t.getFullYear() - i.getFullYear();
			return !a && !l || !o && !a || !l && !o ? function(t) {
				var e = new Date(n);
				return o ? e.setDate(e.getDate() + o * (t - 1)) : a ? e.setMonth(e.getMonth() + a * (t - 1)) : e.setFullYear(e.getFullYear() + l * (t - 1)), r.formatDate(e)
			} : (i = Date.parse(i), e = Date.parse(t) - i, function(t) {
				t = new Date(i + e * (t - 1));
				return r.formatDate(t)
			})
		},
		getDT: function(t) {
			for (var e, n, i, r = t.length, o = 0, a = pq.valid; o < r; o++) {
				if (e = t[o], a.isFloat(e) ? i = "number" : a.isDate(e) && (i = "date"), n && n != i) return "string";
				n = i
			}
			return i
		},
		pattern: function(t) {
			var e = this.getDT(t);
			if ("string" == e || !e) return !1;
			var n, i, r, o = t.length,
				e = "date" === e;
			return e || (t = t.map(function(t) {
				return +t
			})), 2 === o ? e ? this.patternDate2(t[0], t[1]) : (n = t[1] - t[0], i = t[0] - n, function(t) {
				return n * t + i
			}) : 3 === o && (n = (t[2] - 2 * t[1] + t[0]) / 2, i = t[1] - t[0] - 3 * n, r = t[0] - n - i, function(t) {
				return n * t * t + i * t + r
			})
		},
		autofillVal: function(t, e, n, i) {
			var r, o, a, l, s, d = this.that,
				c = t.r1,
				u = t.c1,
				h = t.r2,
				f = t.c2,
				p = e.r1,
				g = e.c1,
				m = e.r2,
				v = e.c2,
				w = [];
			if (i) {
				for ((l = {
						r1: c,
						r2: h
					}).c1 = g < u ? g : f + 1, l.c2 = g < u ? u - 1 : v, s = g - u, o = g; o <= v; o++)
					if (s++, o < u || f < o)
						for (r = 0, a = c; a <= h; a++) w.push(n[r](s, o)), r++
			} else
				for ((l = {
						c1: u,
						c2: f
					}).r1 = p < c ? p : h + 1, l.r2 = p < c ? c - 1 : m, s = p - c, o = p; o <= m; o++)
					if (s++, o < c || h < o)
						for (r = 0, a = u; a <= f; a++) w.push(n[r](s, o)), r++;
			return d.Range(l).value(w), d.focus({
				rowIndxPage: t.r1,
				colIndx: t.c1,
				noscroll: !0
			}), !0
		},
		autofill: function(t, e) {
			var n, i, r, o, a, l, s, d, c = this.that,
				u = c.colModel,
				h = c.get_p_data(),
				f = [],
				p = t.r1,
				g = t.c1,
				m = t.r2,
				v = t.c2,
				w = e.c1 != g || e.c2 != v;
			if (w) {
				for (a = p; a <= m; a++) {
					if (c._trigger("autofillSeries", null, s = {
							sel: {
								r: a,
								c: g
							},
							x: !0
						}), !(d = s.series)) return;
					f.push(d)
				}
				return this.autofillVal(t, e, f, w)
			}
			for (l = g; l <= v; l++) {
				for (i = (n = u[l]).dataType, o = n.dataIndx, r = [], a = p; a <= m; a++) r.push(h[a][o]);
				if (c._trigger("autofillSeries", null, s = {
						cells: r,
						sel: {
							r1: p,
							c: l,
							r2: m,
							r: p
						}
					}), !(d = s.series || this.pattern(r, i))) return;
				f.push(d)
			}
			return this.autofillVal(t, e, f)
		},
		onKeyDown: function(t) {
			var e, n;
			!this.oldAF && pq.isCtrl(t) && (n = (e = this).that.options, e.oldAF = n.autofill, n.autofill = !1, h(document.body).one("keyup", function() {
				n.autofill = e.oldAF, delete e.oldAF
			}))
		},
		onStop: function() {
			var t = this.that,
				e = t.options.autofill,
				n = this.sel,
				i = t.Selection().address()[0];
			n.r1 == i.r1 && n.c1 == i.c1 && n.r2 == i.r2 && n.c2 == i.c2 || e && this.autofill(n, i) || (t.Range(n).copy({
				dest: i
			}), t.focus({
				rowIndxPage: n.r1,
				colIndx: n.c1,
				noscroll: !0
			})), this.locked = !1
		},
		onStart: function() {
			this.locked = !0, this.sel = this.that.Selection().address()[0]
		},
		onDrag: function(t) {
			var e, n, i, r, o, a, l = this.that,
				s = l.options.fillHandle,
				d = "all" == s,
				c = d || "horizontal" == s,
				s = d || "vertical" == s,
				u = t.clientX - 10,
				t = t.clientY,
				u = document.elementFromPoint(u, t),
				t = h(u).closest(".pq-grid-cell");
			t.length && (u = l.getCellIndices({
				$td: t
			}), e = (t = this.sel).r1, n = t.c1, i = t.r2, t = t.c2, r = {
				r1: e,
				c1: n,
				r2: i,
				c2: t
			}, o = function(t, e) {
				r[t] = e, l.Range(r).select()
			}, a = u.rowIndx, u = u.colIndx, d && a <= i && e <= a || c && !s ? t < u ? o("c2", u) : u < n && o("c1", u) : s && (i < a ? o("r2", a) : a < e && o("r1", a)))
		},
		onDblClick: function(l, s) {
			return function() {
				var t = l.options,
					e = t.fillHandle;
				if ("all" == e || "vertical" == e) {
					for (var n, e = l.Selection().address()[0], i = e.c2, r = e.r2 + 1, o = t.dataModel.data, a = l.getColModel()[i].dataIndx; n = o[r];) {
						if (null != n[a] && "" !== n[a]) {
							r--;
							break
						}
						r++
					}
					s.onStart(), l.Range({
						r1: e.r1,
						c1: e.c1,
						r2: r,
						c2: i
					}).select(), s.onStop()
				}
			}
		}
	}
}(jQuery), ! function(r) {
	r(document).on("pqGrid:bootup", function(t, e) {
		new n(e.instance)
	});
	var n = r.paramquery.cScroll = function(t) {
		this.that = t, this.ns = ".pqgrid-csroll", this.rtl = t.options.rtl, t.on("create", this.onCreate.bind(this))
	};
	n.prototype = {
		onCreate: function() {
			var t = this.that,
				e = t.iDrop && t.iDrop.isOn();
			r(e ? document : t.$cont).on("mousedown", this.onMouseDown.bind(this))
		},
		onMouseDown: function(t) {
			var e = this.that,
				t = r(t.target),
				n = (this.$draggable = t.closest(".ui-draggable")).length,
				i = this.ns;
			(n || t.closest(e.$cont).length) && (e = t.closest(".pq-fill-handle").length, r(document).on("mousemove" + i, this[n && !e ? "onMouseMove" : "process"].bind(this)).on("mouseup" + i, this.onMouseUp.bind(this)))
		},
		onMouseMove: function(t) {
			var e = this.that;
			(this.capture || pq.elementFromXY(t).closest(e.$cont).length && e.iDrop.isOver()) && (this.capture = !0, this.process(t))
		},
		onMouseUp: function() {
			r(document).off(this.ns), this.capture = !1
		},
		process: function(t) {
			var e, n, i, r, o, a, l, s, d = this.that.$cont;
			d && (n = d[0].offsetHeight, i = d[0].offsetWidth, e = (d = d.offset()).top, d = d.left, o = (r = t.pageY) - (n = e + n), a = (t = t.pageX) - (i = d + i), l = e - r, s = d - t, d < t && t < i && (0 < o || 0 < l) ? 0 < o ? this.scrollV(o, !0) : 0 < l && this.scrollV(l) : e < r && r < n && (0 < a ? this.scrollH(a, !0) : 0 < s && this.scrollH(s)))
		},
		scrollH: function(t, e) {
			this.scroll(t, this.rtl ? !e : e, !0)
		},
		scrollV: function(t, e) {
			this.scroll(t, e)
		},
		scroll: function(t, e, n) {
			var i = this.that.iRenderB,
				r = i.getContRight()[0],
				o = r[n ? "scrollWidth" : "scrollHeight"],
				r = pq[n ? "scrollLeft" : "scrollTop"](r),
				o = (t = Math.pow(t, o < 1e3 ? 1 : 1 + (o - 1e3) / o), r + (e ? t : -t));
			i[n ? "scrollX" : "scrollY"](o)
		}
	}
}(jQuery), ! function() {
	var t = jQuery.paramquery;
	t.cFormula = function(t) {
		var e = this;
		e.that = t, e.oldF = [], t.one("ready", function() {
			t.on("CMInit", e.onCMInit.bind(e))
		}).on("beforePivotSummary", e.calcMainData.bind(e)).on("dataAvailable", e.onDA.bind(e)).on(!0, "change", e.onChange.bind(e))
	}, t.cFormula.prototype = {
		onCMInit: function() {
			this.isFormulaChange(this.oldF, this.formulas()) && this.calcMainData()
		},
		callRow: function(t, e, n) {
			var i = this.that,
				r = 0;
			if (t)
				for (; r < n; r++) {
					var o = e[r],
						a = o[0],
						l = o[1];
					t[a.dataIndx] = l.call(i, t, a, o[2])
				}
		},
		onDA: function() {
			this.calcMainData()
		},
		isFormulaChange: function(t, e) {
			var n = !1,
				i = 0,
				r = t.length;
			if (r == e.length) {
				for (; i < r; i++)
					if (t[i][1] != e[i][1]) {
						n = !0;
						break
					}
			} else n = !0;
			return n
		},
		calcMainData: function() {
			var t = this.formulaSave(),
				e = this.that,
				n = t.length;
			if (n) {
				for (var i = e.options.dataModel.data, r = i.length; r--;) this.callRow(i[r], t, n);
				e._trigger("formulaComputed")
			}
		},
		onChange: function(t, e) {
			function n(t) {
				r.callRow(t.rowData, a, l)
			}
			var i, r = this,
				o = r.that,
				a = r.formulas(),
				l = a.length,
				s = e.addList,
				e = e.updateList;
			l && (s.forEach(n), e.forEach(n), 1 != e.length || s.length || (i = e[0], a.forEach(function(t) {
				o.refreshCell({
					rowIndx: i.rowIndx,
					dataIndx: t[0].dataIndx
				})
			})))
		},
		formulas: function() {
			var e, n, i, r = this.that,
				o = [],
				a = r.colIndxs;
			return (r.options.formulas || []).forEach(function(t) {
				i = t[0], (e = r.getColumn({
					dataIndx: i
				})) && (n = t[1]) && o.push([e, n, a[i]])
			}), o
		},
		formulaSave: function() {
			var t = this.formulas();
			return this.oldF = t
		}
	}
}(), ! function(l) {
	var t = l.paramquery,
		n = (t.pqGrid.defaults.treeModel = {
			cbId: "pq_tree_cb",
			source: "checkboxTree",
			childstr: "children",
			iconCollapse: ["ui-icon-triangle-1-se", "ui-icon-triangle-1-e"],
			iconFolder: ["ui-icon-folder-open", "ui-icon-folder-collapsed"],
			iconFile: "ui-icon-document",
			id: "id",
			indent: 18,
			parentId: "parentId",
			refreshOnChange: !0
		}, t.pqGrid.prototype.Tree = function() {
			return this.iTree
		}, l(document).on("pqGrid:bootup", function(t, e) {
			e = e.instance;
			e.iTree = new n(e)
		}), t.cTree = function(t) {
			var e = this;
			e.Model = t.options.treeModel, e.that = t, e.fns = {}, e.init(), e.isTree = !0, e.cache = {}, e.di_prev, e.chkRows = [], Object.defineProperty(e.Model, "nodeClose", {
				get: function() {
					return e.fillState({})
				},
				set: function(t) {
					e.nodeClose = t
				}
			})
		});
	n.prototype = l.extend({}, pq.mixin.ChkGrpTree, pq.mixin.GrpTree, {
		addNodes: function(t, e, n) {
			var i, r, o, a, l, s = this,
				d = s.that,
				c = d.options.dataModel,
				u = s.Model,
				c = c.data,
				h = s.parentId,
				f = s.childstr,
				p = s.id,
				g = {},
				m = [],
				v = 0,
				w = s.cache,
				x = [];
			if (t.forEach(function(t) {
					a = t[h], l = l || w[a], s.eachChild(t, function(t, e) {
						var n = t[p];
						w[n] || g[n] || (g[n] = t, e && (t[h] = e[p]), m.push(t))
					}, e || w[a])
				}), m.forEach(function(t) {
					a = t[h], g[a] || w[a] || delete t[h]
				}), o = !(r = (t = ((e = e || l) || {})[f] || s.getRoots() || []).length) || 0 == n ? e : null == n || r < n ? t[r - 1] : t[n - 1], i = c.indexOf(o) + 1, r = m.length) {
				for (; v < r; v++) o = m[v], x.push({
					newRow: o,
					rowIndx: i++
				});
				d._digestData({
					addList: x,
					checkEditable: !1,
					source: "addNodes",
					history: u.historyAdd
				}), s.refreshView()
			}
		},
		updateId: function(t, e) {
			var n = this.id,
				i = this.parentId,
				r = t[n],
				o = this.cache;
			o[e] || (o[t[n] = e] = t, delete o[r], (this.getChildren(t) || []).forEach(function(t) {
				t[i] = e
			}))
		},
		collapseAll: function(t) {
			this[t ? "expandNodes" : "collapseNodes"](this.that.options.dataModel.data)
		},
		collapseNodes: function(t, e, n) {
			for (var i, r = 0, o = this.that, a = t.length, l = [], s = !n; r < a; r++) i = t[r], this.isFolder(i) && this.isCollapsed(i) !== s && l.push(i);
			if (l.length && !(n = {
					close: s,
					nodes: l
				}) !== o._trigger("beforeTreeExpand", e, n)) {
				for (a = l.length, r = 0; r < a; r++)(i = l[r]).pq_close = s;
				o._trigger("treeExpand", e, n), this.setCascadeInit(!1), this.refreshView()
			}
		},
		deleteNodes: function(t) {
			var e, n, i = this.that,
				r = this.Model,
				o = 0,
				a = {},
				l = this.id,
				s = [];
			if (t) {
				for (e = t.length; o < e; o++) n = t[o], this.eachChild(n, function(t) {
					var e = t[l];
					a[e] || (a[e] = 1, s.push({
						rowData: t
					}))
				});
				i._digestData({
					deleteList: s,
					source: "deleteNodes",
					history: r.historyDelete
				}), this.refreshView()
			}
		},
		makeLeaf: function(t) {
			t[this.childstr] = t.pq_close = t.pq_child_sum = void 0
		},
		expandAll: function() {
			this.collapseAll(!0)
		},
		expandNodes: function(t, e) {
			this.collapseNodes(t, e, !0)
		},
		expandTo: function(t) {
			for (var e = []; t.pq_close && e.push(t), t = this.getParent(t););
			this.expandNodes(e)
		},
		exportCell: function(t, e) {
			for (var n = "", i = 0; i < e; i++) n += "- ";
			return n + (null == t ? "" : t)
		},
		filter: function(t, e, n, i, r, o, a) {
			function l(t, e) {
				c = e || c, a ? t.pq_hidden = t.pq_filter = !e : (e ? r : o).push(t)
			}
			for (var s, d, c, u, h = this.childstr, f = this.Model.filterShowChildren, p = 0, g = t.length; p < g; p++) {
				if (d = !1, u = (s = t[p])[h]) {
					if (f && n.isMatchRow(s, e, i)) {
						this.eachChild(s, function(t) {
							l(t, !0)
						}), c = !0;
						continue
					}(d = this.filter(u, e, n, i, r, o, a)) && l(s, !0)
				}
				d || l(s, n.isMatchRow(s, e, i))
			}
			return c
		},
		getFormat: function() {
			for (var t, e, n = this.that.options.dataModel.data, i = 0, r = n.length, o = this.parentId, a = this.childstr; i < r && null == (t = n[i])[o]; i++)
				if ((e = t[a]) && e.length) return this.getParent(e[0]) == t ? "flat" : "nested";
			return "flat"
		},
		getLevel: function(t) {
			return t.pq_level
		},
		_groupById: function(t, e, n, i, r) {
			for (var o = this.childstr, a = 0, l = n.length; a < l; a++) {
				var s = n[a],
					d = s[e];
				s.pq_level = r, t.push(s), (d = i[d]) ? (s[o] = d, this._groupById(t, e, d, i, r + 1)) : null == s.pq_close && !s[o] || (s[o] = [])
			}
		},
		groupById: function(t) {
			for (var e, n, i, r = this.id, o = this.parentId, a = {}, l = [], s = 0, d = t.length; s < d; s++)(n = (n = a[e = null == (e = (i = t[s])[o]) ? "" : e]) ? n : a[e] = []).push(i);
			return this._groupById(l, r, a[""] || [], a, 0), l
		},
		init: function() {
			var t = this,
				e = t.that,
				n = e.options,
				i = t.Model,
				r = i.cbId,
				o = t.dataIndx = i.dataIndx;
			t.cbId = r, t.prop = "pq_tree_prop", t.id = i.id, t.parentId = i.parentId, t.childstr = i.childstr, t.onCMInit(), o ? t._init || (t.on("CMInit", t.onCMInit.bind(t)).on("dataAvailable", t.onDataAvailable.bind(t)).on("dataReadyAfter", t.onDataReadyAfter.bind(t)).on("beforeCellKeyDown", t.onBeforeCellKeyDown.bind(t)).on("customSort", t.onCustomSortTree.bind(t)).on("customFilter", t.onCustomFilter.bind(t)).on("clearFilter", t.onClearFilter.bind(t)).on("change", t.onChange(t, e, i)).on("cellClick", t.onCellClick.bind(t)).on("refresh refreshRow", t.onRefresh(t, i)).on("valChange", t.onCheckbox(t, i)).on("refreshHeader", t.onRefreshHeader.bind(t)).on("beforeCheck", t.onBeforeCheck.bind(t)), t.setCascadeInit(!0), t._init = !0) : t._init && (t.off(), t._init = !1), t._init && (n.groupModel.on = i.summary)
		},
		initData: function() {
			var t = this.that.options.dataModel;
			t.data = this["flat" == this.getFormat() ? "groupById" : "flatten"](t.data), this.buildCache()
		},
		isCollapsed: function(t) {
			return !!t.pq_close
		},
		isOn: function() {
			return null != this.Model.dataIndx
		},
		moveNodes: function(n, i, t, e) {
			var r, o, a, l, s, d, c, u = this,
				h = arguments,
				f = u.that,
				p = t,
				g = u.parentId,
				m = u.id,
				v = u.childstr,
				w = f.options,
				x = u.Model,
				w = w.dataModel,
				y = u.getRoots(),
				C = !e,
				b = i ? i[v] = i[v] || [] : y,
				I = b.length,
				q = u.getUniqueNodes(n),
				t = null == t || I <= t ? I : t,
				_ = b;
			if (i && (o = i[m]), d = q.length) {
				if (f._trigger("beforeMoveNode", null, {
						args: h
					}), C && 1 < d)
					for (c = q[0], r = (a = u.getParent(c)) ? a[v] : y, l = r.indexOf(c), s = 1; s < d; s++)
						if (r[s + l] != q[s]) {
							C = !1;
							break
						} for (s = 0; s < d; s++) c = q[s], r = (a = u.getParent(c)) ? a[v] : y, l = r.indexOf(c), a == i ? t = pq.moveItem(c, _, l, t) : (_.splice(t++, 0, c), r.splice(l, 1)), x.leafIfEmpty && a && u.isEmpty(a) && u.makeLeaf(a), c[g] = o;
				x.historyMove && C && f.iHistory.push({
					callback: function(t) {
						var e = l;
						i == a && p < e && (e += 1), u.moveNodes(n, t ? i : a, t ? p : e, !0)
					}
				}), w.data = u.flatten(y), f._trigger("moveNode", null, {
					args: h
				}), f.refreshView()
			}
		},
		off: function() {
			var t, e = this.fns,
				n = this.that;
			for (t in e) n.off(t, e[t]);
			this.fns = {}
		},
		on: function(t, e) {
			return this.fns[t] = e, this.that.on(t, e), this
		},
		onCellClick: function(t, e) {
			e.dataIndx == this.dataIndx && l(t.originalEvent.target).hasClass("pq-group-icon") && (pq.isCtrl(t) ? this[e.rowData.pq_close ? "expandAll" : "collapseAll"]() : this.toggleNode(e.rowData, t))
		},
		onBeforeCellKeyDown: function(t, e) {
			var n, i = this.that,
				r = e.rowData,
				o = e.dataIndx,
				t = t.keyCode,
				a = l.ui.keyCode;
			if (o == this.dataIndx) return this.isFolder(r) && (n = r.pq_close, t == a.ENTER && !i.isEditable({
				rowIndx: r.pq_ri,
				dataIndx: o
			}) || !n && t == a.LEFT || n && t == a.RIGHT) ? (this.toggleNode(r), !1) : t == a.SPACE && (o = i.getCell(e).find("input[type='checkbox']")).length ? (o.click(), !1) : void 0
		},
		hasSummary: function() {
			var t = this.Model;
			return t.summary || t.summaryInTitleRow
		},
		onChange: function(o, a, l) {
			return function(t, e) {
				var n = e.source || "",
					i = e.addList.length,
					e = e.deleteList,
					r = e.length; - 1 == n.indexOf("checkbox") && ("undo" != n && "redo" != n || !i && !r ? o.hasSummary() && l.refreshOnChange && !i && !r ? (o.refreshSummary(!0), a.refresh()) : "addNodes" != n && "deleteNodes" != n || o.refreshViewFull() : o.refreshViewFull(), l.leafIfEmpty && e.forEach(function(t) {
					t = o.getParent(t.rowData);
					t && o.isEmpty(t) && o.makeLeaf(t)
				}))
			}
		},
		clearFolderCheckbox: function(t) {
			var e = this,
				n = e.cbId;
			t.forEach(function(t) {
				e.isFolder(t) && delete t[n]
			})
		},
		onClearFilter: function(t, e) {
			return this.clearFolderCheckbox(e.data), e.data = this.groupById(e.data), !1
		},
		onCustomFilter: function(t, e) {
			var n = this.that,
				i = this.groupById(e.data),
				n = n.iFilterData,
				r = e.filters,
				o = [],
				a = [],
				l = e.mode;
			return this.filter(this.getRoots(i), r, n, l, o, a, e.hideRows), e.dataTmp = this.groupById(o), e.dataUF = a, this.clearFolderCheckbox(e.dataTmp), !1
		},
		onDataAvailable: function() {
			this.initData()
		},
		refreshSummary: function(t) {
			this.summaryT(), this.that.iRefresh.addRowIndx(), t && this.showHideRows()
		},
		onDataReadyAfter: function() {
			var t = this.that.options.dataModel,
				e = this.Model;
			!this.hasSummary() || e.filterLockSummary && e.summaryInTitleRow && t.dataUF.length || this.refreshSummary(), this.showHideRows(), this.isCascade(e) && this.cascadeInit()
		},
		option: function(t, e) {
			var n = this.that,
				i = this.Model,
				r = i.dataIndx;
			l.extend(i, t), t = i.dataIndx, this.setCellRender(), this.init(), !r && t && this.initData(), !1 !== e && n.refreshView()
		},
		renderCell: function(v, w) {
			return function(t) {
				var e, n, i, r, o = t.rowData,
					a = v.that,
					l = w.indent,
					s = t.column,
					d = s.renderLabel || w.render,
					c = w.iconCollapse,
					u = w.checkbox,
					h = v.isFolder(o),
					f = v._iconCls(o, h, w),
					p = o.pq_level || 0,
					g = p * l,
					m = ["pq-group-title-cell"],
					l = ["text-indent:", h ? g : +l + g, "px;"],
					g = t.formatVal || t.cellData;
				return d && null != (a = a.callFn(d, t)) && ("string" != typeof a ? (a.iconCls && (f = a.iconCls), null != a.text && (g = a.text), i = a.attr, m.push(a.cls), l.push(a.style)) : g = a), t.Export ? v.exportCell(g, p) : (u && (d = v.renderCB(u, o, w.cbId)) && (r = d[0], d[1] && m.push(d[1])), h && (e = "<span class='pq-group-icon ui-icon " + (o.pq_close ? c[1] : c[0]) + "'></span>"), f && (n = "<span class='pq-tree-icon ui-icon " + f + "'></span>"), a = r && (s.useLabel || w.useLabel), {
					cls: m.join(" "),
					attr: i,
					style: l.join(""),
					text: [e, n, a ? "<label>" : "", r, g, a ? "</label>" : ""].join("")
				})
			}
		},
		refreshViewFull: function(t) {
			var e = this.that.options.dataModel;
			e.data = this.groupById(e.data), this.buildCache(), t && this.refreshView()
		},
		_iconCls: function(t, e, n) {
			if (n.icons) return e && (e = n.iconFolder) ? t.pq_close ? e[1] : e[0] : t.pq_gsummary ? void 0 : n.iconFile
		},
		setCellRender: function() {
			var t, e = this.that,
				n = this.Model,
				i = e.columns;
			n.summary && e.iGroup.refreshColumns(), (e = this.di_prev) && ((t = i[e]) && (t._render = null), this.di_prev = null), (e = n.dataIndx) && ((t = i[e])._render = this.renderCell(this, n), this.di_prev = e)
		},
		_showHideRows: function(t, e, n) {
			for (var i, r, o, a, l = this.id, s = this.nodeClose, d = e || this.getRoots(), c = this.childstr, u = n || !1, h = d.length, f = 0; f < h; f++)(r = d[f]).pq_filter || (r.pq_hidden = u), (a = r[c]) && (s && null != (i = s[o = r[l]]) && (delete s[o], r.pq_close = i), o = u || r.pq_close, this._showHideRows(t, a, o))
		},
		showHideRows: function() {
			var t, e, n, i = this.that,
				r = 0,
				o = i.get_p_data(),
				a = this.Model.summary;
			if (this._showHideRows(o), a)
				for (e = (o = i.pdata).length; r < e; r++)(n = o[r]).pq_gsummary && (t = this.getParent(n)) && (n.pq_hidden = t.pq_hidden)
		},
		toggleNode: function(t, e) {
			this[t.pq_close ? "expandNodes" : "collapseNodes"]([t], e)
		}
	})
}(jQuery), ! function() {
	function t(t) {
		t = (this.that = t).options, this.options = t, this.selection = [], this.hclass = " pq-state-select ui-state-highlight"
	}
	var e = jQuery.paramquery,
		n = e.pqGrid.prototype;
	e.cRows = t, n.SelectRow = function() {
		return this.iRows
	}, t.prototype = {
		_add: function(t, e) {
			var n = this.that,
				i = t.rowIndxPage,
				e = !e,
				r = t.rowData,
				i = this.inViewRow(i);
			return !r.pq_hidden && i && (i = n.getRow(t)).length && (i[e ? "addClass" : "removeClass"](this.hclass), e || i.removeAttr("tabindex")), r.pq_rowselect = e, t
		},
		_data: function(t) {
			var e = this.that,
				t = (t = t || {}).all,
				n = e.riOffset,
				n = t ? 0 : n,
				i = e.get_p_data();
			return [i, n, n + (t ? i : e.pdata).length]
		},
		add: function(t) {
			var e = t.addList = t.rows || [{
				rowIndx: t.rowIndx
			}];
			t.isFirst && this.setFirst(e[0].rowIndx), this.update(t)
		},
		extend: function(t) {
			var e, n, i, r, t = t.rowIndx,
				o = [],
				a = this.getFirst();
			if (null != a && null != (r = this.isSelected({
					rowIndx: a
				}))) {
				for (i = t < a ? (n = a = [t, t = a][0], t - 1) : (n = a + 1, t), e = n; e <= i; e++) o.push({
					rowIndx: e
				});
				this.update(r ? {
					addList: o
				} : {
					deleteList: o
				})
			}
		},
		getFirst: function() {
			return this._firstR
		},
		getSelection: function() {
			for (var t, e = this.that.get_p_data(), n = 0, i = e.length, r = []; n < i; n++)(t = e[n]) && t.pq_rowselect && r.push({
				rowIndx: n,
				rowData: t
			});
			return r
		},
		inViewCol: function(t) {
			var e = this.that,
				n = e.options,
				e = e.iRenderB;
			return t < n.freezeCols || t >= e.initH && t <= e.finalH
		},
		inViewRow: function(t) {
			var e = this.that,
				n = e.options,
				e = e.iRenderB;
			return t < n.freezeRows || t >= e.initV && t <= e.finalV
		},
		isSelected: function(t) {
			t = t.rowData || this.that.getRowData(t);
			return t ? !0 === t.pq_rowselect : null
		},
		isSelectedAll: function(t) {
			for (var e, t = this._data(t), n = t[0], i = t[1], r = t[2]; i < r; i++)
				if ((e = n[i]) && !e.pq_rowselect) return !1;
			return !0
		},
		removeAll: function(t) {
			this.selectAll(t, !0)
		},
		remove: function(t) {
			var e = t.deleteList = t.rows || [{
				rowIndx: t.rowIndx
			}];
			t.isFirst && this.setFirst(e[0].rowIndx), this.update(t)
		},
		replace: function(t) {
			t.deleteList = this.getSelection(), this.add(t)
		},
		selectAll: function(t, e) {
			for (var n, i = [], r = this.that.riOffset, t = this._data(t), o = t[0], a = t[1], l = t[2]; a < l; a++)(n = o[a]) && i.push({
				rowIndx: a,
				rowIndxPage: a - r,
				rowData: n
			});
			this.update(e ? {
				deleteList: i
			} : {
				addList: i
			}, !0)
		},
		setFirst: function(t) {
			this._firstR = t
		},
		toRange: function() {
			for (var t, e, n = [], i = this.that, r = i.get_p_data(), o = 0, a = r.length; o < a; o++) r[o].pq_rowselect ? null != t ? e = o : t = e = o : null != t && (n.push({
				r1: t,
				r2: e
			}), t = e = null);
			return null != t && n.push({
				r1: t,
				r2: e
			}), i.Range(n)
		},
		toggle: function(t) {
			this[this.isSelected(t) ? "remove" : "add"](t)
		},
		toggleAll: function(t) {
			this[this.isSelectedAll(t) ? "removeAll" : "selectAll"](t)
		},
		update: function(t, e) {
			function n(t) {
				return e ? t : r.normalizeList(t)
			}
			var i = this,
				r = i.that,
				o = {
					source: t.source
				},
				a = n(t.addList || []),
				t = n(t.deleteList || []),
				a = a.filter(function(t) {
					return !1 === i.isSelected(t)
				}),
				t = t.filter(i.isSelected.bind(i));
			(a.length || t.length) && (o.addList = a, o.deleteList = t, !1 !== r._trigger("beforeRowSelect", null, o) && (o.addList.forEach(function(t) {
				i._add(t)
			}), o.deleteList.forEach(function(t) {
				i._add(t, !0)
			}), r._trigger("rowSelect", null, o)))
		}
	}
}(), ! function(t) {
	var E = t.paramquery,
		n = (t(document).on("pqGrid:bootup", function(t, e) {
			e = e.instance;
			e.iImport = new n(e)
		}), E.pqGrid.prototype.importWb = function(t) {
			return this.iImport.importWb(t)
		}, E.cImport = function(t) {
			this.that = t
		});
	n.prototype = {
		fillRows: function(t, e, n) {
			for (var i = t.length; i < e; i++) t.push(n ? {} : [])
		},
		generateCols: function(t, e, n) {
			var i, r, o = [],
				a = 0,
				l = 0,
				s = pq.excel.colWidth,
				d = [],
				n = n ? n.cells : [],
				c = [];
			for (n.forEach(function(t, e) {
					e = t.indx || e;
					c[e] = t.value, d[e] = t
				}), (e = e || []).forEach(function(t, e) {
					l = t.indx || e, o[l] = t
				}), t = Math.max(t, e.length, l + 1); a < t; a++) i = o[a] || {}, r = {
				_title: c[a] || "",
				title: this._render,
				width: i.width || s,
				style: {},
				styleHead: {},
				halign: "center"
			}, this.copyStyle(i, r, r.style), this.copyStyle(d[a] || {}, {}, r.styleHead), i.hidden && (r.hidden = !0), o[a] = r;
			return o
		},
		_render: function(t) {
			return t.column._title || pq.toLetter(t.colIndx)
		},
		importS: function(t, e, n, i, r) {
			var o, a, l, s, d, c, u, h, f, p, g, m, v, w, x = t.mergeCells,
				y = this,
				C = [],
				b = {},
				I = y.that,
				q = 0,
				_ = t.rows || [],
				R = t.frozenRows || 0,
				D = (_.length, 0),
				M = I.colModel,
				T = 0,
				S = M && M.length,
				k = E.cFormulas.shiftRC();
			for (null != r && (T = r + 1, u = _[r], q = u.cells.length, (_ = _.slice(T)).forEach(function(t) {
					null != t.indx && (t.indx -= T)
				}), R = 0 < (R -= T) ? R : 0), D = 0, o = _.length; D < o; D++) l = (a = _[D]).indx || D, h = (s = {}).pq_cellprop = {}, f = s.pq_cellstyle = {}, p = s.pq_cellattr = {}, g = s.pq_rowstyle = {}, m = s.pq_rowprop = {}, y.copyStyle(a, m, g), l != D && y.fillRows(C, l, !0), (a.cells || []).forEach(function(t, e) {
				d = t.indx || e, c = i && S && M[d] ? M[d].dataIndx : d, s[c] = t.value, w = h[c] = {}, v = f[c] = {}, y.copyStyle(t, w, v), (v = t.comment) && (p[c] = {
					title: v
				}), (v = t.link) && (w.link = v), (w = t.formula) && y.copyFormula(s, c, T ? k(w, 0, -T) : w), q <= d && (q = d + 1)
			}), 0 <= a.htFix && (s.pq_ht = a.htFix, s.pq_htfix = !0), a.hidden && (s.pq_hidden = !0), C[l] = s;
			return b.title = t.name, e && y.fillRows(C, C.length + e, !0), b.dataModel = {
				data: C
			}, q += n || 0, !i && q && (b.colModel = y.generateCols(q, t.columns, u)), b.mergeCells = (x || []).map(function(t) {
				t = pq.getAddress(t);
				return t.r1 -= T, t.r2 -= T, t
			}).filter(function(t) {
				return 0 <= t.r1
			}), b.freezeRows = R, b.freezeCols = t.frozenCols, b.pics = t.pics, b
		},
		copyFormula: function(t, e, n) {
			(t.pq_fn = t.pq_fn || {})[e] = n
		},
		copyStyle: function(t, e, n) {
			var i, r, o;
			if (null != (i = t.font) && (n["font-family"] = i), null != (i = t.fontSize) && (n["font-size"] = i && i + "pt"), null != (i = t.color) && (n.color = i), null != (i = t.bgColor) && (n["background-color"] = i), null != (i = t.bold) && (n["font-weight"] = i && "bold"), null != (i = t.italic) && (n["font-style"] = i && "italic"), null != (i = t.underline) && (n["text-decoration"] = i && "underline"), null != (i = t.wrap) && (n["white-space"] = i ? "normal" : ""), null != (i = t.align) && (e.align = i), null != (i = t.valign) && (e.valign = i), null != (i = t.format) && (i = pq.isDateFormat(i) ? pq.excelToJui(i) : i, e.format = i), i = t.border)
				for (r in i) o = i[r], n["border-" + r] = o
		},
		applyOptions: function(t, e) {
			var n = t.options.dataModel,
				i = e.dataModel;
			if (i) {
				for (var r in i) n[r] = i[r];
				delete e.dataModel
			}
			t.option(e)
		},
		importWb: function(e) {
			function t(t) {
				return r.importS(t, e.extraRows, e.extraCols, e.keepCM, e.headerRowIndx)
			}

			function n(t) {
				r.applyOptions(o, t)
			}
			var i = e.workbook,
				r = (i.activeId, this),
				o = r.that,
				a = e.sheet,
				a = a || 0;
			(i = i.sheets.filter(function(t, e) {
				return a == e || a && a == t.name
			})[0]) && n(t(i)), o._trigger("importWb"), o.refreshDataAndView()
		}
	}
}(jQuery), ! function(g) {
	var e;
	pq.excelImport = {
		attr: (e = new RegExp('([a-z]+)\\s*=\\s*"([^"]*)"', "gi"), function(t) {
			t = (t = t || "").slice(0, t.indexOf(">"));
			var i = {};
			return t.replace(e, function(t, e, n) {
				i[e] = n
			}), i
		}),
		getComment: function(t) {
			var n = this,
				i = {};
			return t.length && (t = g(t.find('Relationship[Type*="/comments"]')[0]).attr("Target")) && (t = t.split("/").pop(), (n.getFileText("xl/" + t).match(/<comment\s+[^>]*>([\s\S]*?)<\/comment>/g) || []).forEach(function(t) {
				var e = n.attr(t).ref,
					t = t.match(/<t(\s+[^>]*)?>([\s\S]*?)(?=<\/t>)/g),
					t = n.match(t[t.length - 1], /[^>]*>([\s\S]*)/, 1);
				i[e] = pq.unescapeXml(g.trim(t))
			})), i
		},
		getLinks: function(t, n) {
			var i = {},
				r = this;
			return n.length && (t.match(/<hyperlink[^s](.*?)\/>/g) || []).forEach(function(t) {
				var t = r.attr(t),
					e = t.ref,
					t = t.id,
					t = n.find('Relationship[Type*="/hyperlink"][Id="' + t + '"]').attr("Target");
				t && (i[e] = t)
			}), i
		},
		getPic: function(t, e) {
			var n, c = [],
				i = this.files,
				t = this.match(t, /<drawing\s+r:id=\"([^\"]*)\"(\s*)\/>/i, 1);
			if (t) {
				var r, o, u, e = (e = g(e.find('Relationship[Id="' + t + '"]')[0]).attr("Target") || "").split("/").pop(),
					h = {},
					f = {},
					t = this.pxml("xl/drawings/" + e),
					e = this.pxml("xl/drawings/_rels/" + e + ".rels"),
					p = ["col", "colOff", "row", "rowOff"];
				for (n in e.find("Relationship[Type*='/image']").each(function(t, e) {
						o = g(e), h[o.attr("Id")] = o.attr("Target").match(/media\/(.*)/)[1]
					}), i) /media\/.*/.test(n) && (r = n.match(/media\/(.*)/)[1], f[r] = this.getBase64(i[n]));
				t.find("xdr\\:twoCellAnchor,xdr\\:oneCellAnchor").each(function(t, e) {
					var e = g(e),
						n = e.find("xdr\\:cNvPr"),
						i = n.attr("descr"),
						n = n.attr("id"),
						r = e.find("a\\:blip").attr("r:embed"),
						r = h[r],
						o = e.find("xdr\\:from"),
						a = e.find("xdr\\:to"),
						e = e.find("xdr\\:ext"),
						l = a.length,
						s = [],
						d = l ? [] : null;
					p.forEach(function(t, e) {
						u = e % 2 ? 9500 : 1, s.push(o.find("xdr\\:" + t).text() / u), l && d.push(a.find("xdr\\:" + t).text() / u)
					}), c.push({
						id: n,
						name: i,
						src: f[r],
						from: s,
						to: d,
						cx: l ? 0 : e.attr("cx") / 9500,
						cy: l ? 0 : e.attr("cy") / 9500
					})
				})
			}
			return c
		},
		getBase64: function(t) {
			return "data:image/png;base64," + JSZip.base64.encode(t.asBinary())
		},
		pxml: function(t) {
			return g(g.parseXML(this.getFileText(t)))
		},
		pxmlstr: function(t) {
			return g(g.parseXML(g.trim(t)))
		},
		cacheTheme: function() {
			var t = this.pxmlstr(this.getFileTextFromKey("th")).find("a\\:clrScheme").children(),
				n = this.themeColor = ["FFFFFF", "000000"];
			t.each(function(t, e) {
				1 < t && (e = g(e).children().attr("val"), 2 == t ? n[3] = e : 3 == t ? n[2] = e : n[t] = e)
			})
		},
		colorFromNode: function(t) {
			for (var e, n, i = t.attributes, r = 0; r < i.length; r++) {
				var o = i[r],
					a = o.name,
					o = o.value;
				"indexed" == a ? e = this.indexes[o] : "rgb" == a ? e = o.slice(2) : "theme" == a ? e = this.themeColor[o] : "tint" == a && (n = o)
			}
			if (e) return "#" + (e = n ? pq.tint(e, n) : e)
		},
		indexes: ["000000", "FFFFFF", "FF0000", "00FF00", "0000FF", "FFFF00", "FF00FF", "00FFFF", "000000", "FFFFFF", "FF0000", "00FF00", "0000FF", "FFFF00", "FF00FF", "00FFFF", "800000", "008000", "000080", "808000", "800080", "008080", "C0C0C0", "808080", "9999FF", "993366", "FFFFCC", "CCFFFF", "660066", "FF8080", "0066CC", "CCCCFF", "000080", "FF00FF", "FFFF00", "00FFFF", "800080", "800000", "008080", "0000FF", "00CCFF", "CCFFFF", "CCFFCC", "FFFF99", "99CCFF", "FF99CC", "CC99FF", "FFCC99", "3366FF", "33CCCC", "99CC00", "FFCC00", "FF9900", "FF6600", "666699", "969696", "003366", "339966", "003300", "333300", "993300", "993366", "333399", "333333", "000000"],
		cacheStyles: function() {
			var d, a = this,
				t = a.pxmlstr(a.getStyleText()),
				c = g.extend(!0, {}, a.preDefFormats),
				u = [],
				h = [],
				f = ["", ""],
				p = [],
				o = (t.find("numFmts>numFmt").each(function(t, e) {
					var e = g(e),
						n = i = e.attr("formatCode"),
						i = (i = /(?=.*m.*)(?=.*d.*)(?=.*y.*)/i.test(n) ? n.replace(/(\[.*\]|[^mdy\/\-\s])/gi, "") : i).replace(/\\/gi, "");
					c[e.attr("numFmtId")] = i
				}), t.find("fills>fill>patternFill>fgColor").each(function(t, e) {
					f.push(a.colorFromNode(e))
				}), {
					double: "3px",
					thick: "3px",
					medium: "2px"
				}),
				l = {
					thin: "solid",
					medium: "solid",
					thick: "solid",
					hair: "dotted"
				};
			t.find("borders>border").each(function(t, e) {
				var e = g(e).children(),
					r = {};
				e.each(function(t, e) {
					var n = g(e),
						i = n.children()[0];
					i && (n = n.attr("style"), r[e.tagName] = (o[n] || "1px") + " " + (l[n] || n) + " " + (a.colorFromNode(i) || "#000000"))
				}), p.push(r)
			}), t.find("fonts>font").each(function(t, e) {
				var e = g(e),
					n = +e.find("sz").attr("val"),
					i = e.find("name").attr("val"),
					r = e.find("color")[0],
					o = {};
				e.find("b").length && (o.bold = !0), (r = r && a.colorFromNode(r)) && (o.color = r), i && null != i.toUpperCase() && (o.font = i), n && null != n && (o.fontSize = n), e.find("u").length && (o.underline = !0), e.find("i").length && (o.italic = !0), h.push(o)
			}), t.find("cellXfs>xf").each(function(t, e) {
				var n, e = g(e),
					i = +e.attr("numFmtId"),
					r = +e.attr("fillId"),
					o = +e.attr("borderId"),
					a = e.children("alignment"),
					e = +e.attr("fontId"),
					l = null == e ? {} : h[e],
					s = {};
				for (n in a.length && ((e = a.attr("horizontal")) && (s.align = e), (e = a.attr("vertical")) && (s.valign = e), "1" == a.attr("wrapText") && (s.wrap = !0)), i && (d = c[i], s.format = d), o && (s.border = p[o]), r && f[r] && (s.bgColor = f[r]), l) s[n] = l[n];
				u.push(s)
			}), a.getStyle = function(t) {
				return u[t]
			}
		},
		getMergeCells: function(t) {
			var e = this;
			return (t.match(/<mergeCell\s+.*?(\/>|<\/mergeCell>)/g) || []).map(function(t) {
				return e.attr(t).ref
			})
		},
		getFrozen: function(t) {
			var t = this.match(t, /<pane.*?(\/>|<\/pane>)/, 0),
				t = this.attr(t),
				e = +t.xSplit;
			return {
				r: +t.ySplit || 0,
				c: e || 0
			}
		},
		getFormula: function(r) {
			var o = {},
				a = g.paramquery.cFormulas.shiftRC();
			return function(t, e, n) {
				var i;
				if ("<f" === t.substr(0, 2)) return i = r.match(t, /^<f.*?>(.*?)<\/f>/, 1), "shared" == (t = r.attr(t)).t && (i ? o[t.si] = {
					r: e,
					c: n,
					f: i
				} : (t = o[t.si], i = a(t.f, n - t.c, e - t.r))), i
			}
		},
		getCols: function(t) {
			for (var e = (t.match(/<dimension\s.*?\/>/) || [])[0], e = this.attr(e || "").ref, n = [], i = t.match(/<col\s.*?\/>/g) || [], r = i.length, o = e ? pq.getAddress(e).c2 + 1 : 0, a = o || r, l = pq.excel.colRatio, s = 0; s < r; s++) {
				var d, c, u = i[s],
					u = this.attr(u),
					h = +u.min,
					f = +u.max,
					p = +u.hidden,
					g = +u.width,
					u = u.style,
					m = h,
					v = u ? this.getStyle(u) : {};
				if (o) {
					if (a < s) break;
					f = Math.min(f, a)
				}
				for (; m <= f; m++) {
					for (c in d = {}, p ? d.hidden = !0 : d.width = +(g * l).toFixed(2), m !== n.length + 1 && (d.indx = m - 1), v) d[c] = v[c];
					n.push(d)
				}
			}
			return n
		},
		getColor: function(t) {
			return "#" + t.slice(2)
		},
		getPath: function(t) {
			return this.paths[t]
		},
		getPathSheets: function() {
			return this.pathSheets
		},
		getFileTextFromKey: function(t) {
			return this.getFileText(this.getPath(t))
		},
		getFileText: function(t) {
			return t && (t = this.files[t.replace(/^\//, "")]) ? t.asText().replace(/\<x\:/g, "<").replace(/\<\/x\:/g, "</") : ""
		},
		getSheetText: function(n) {
			n = n || 0;
			var t = this.pathSheets.filter(function(t, e) {
				return t.name === n || e === n
			})[0].path;
			return this.getFileText(t)
		},
		getStyleText: function() {
			return this.getFileTextFromKey("st")
		},
		getSI: function(t) {
			var n, i = [],
				r = pq.unescapeXml,
				e = +this.attr(this.match(t, /<sst.*?>[\s\S]*?<\/sst>/, 0)).uniqueCount;
			if (t.replace(/<si>([\s\S]*?)<\/si>/g, function(t, e) {
					n = [], e.replace(/<t.*?>([\s\S]*?)<\/t>/g, function(t, e) {
						n.push(e)
					}), i.push(r(n.join("")))
				}), e && e !== i.length) throw "si misatch";
			return i
		},
		getCsv: function(t, e) {
			var i = [],
				r = Math.random() + "";
			return t = t.replace("\ufeff", "").replace(/(?:^|[^"]+)"(([^"]|"{2})+)"(?=([^"]+|$))/g, function(t, e) {
				var n = t.indexOf(e);
				return i.push(e.replace(/""/g, '"')), t.slice(0, n - 1) + r + (i.length - 1) + r
			}), e = e || new RegExp(-1 == t.indexOf("\t") ? "," : "\t", "g"), {
				sheets: [{
					rows: (t = t.split(/\r\n|\r|\n/g)).map(function(t) {
						return {
							cells: t.split(e).map(function(t) {
								var e;
								return 0 == t.indexOf(r) ? (e = t.slice(r.length, t.indexOf(r, 1)), t = i[e]) : '""' === t && (t = ""), {
									value: t
								}
							})
						}
					})
				}]
			}
		},
		getWorkBook: function(t, e, r) {
			var o = this,
				n = {},
				e = (e ? n[e] = !0 : pq.isStr(t) && (n.base64 = !0), o.files = new JSZip(t, n).files, o.readPaths(), o.cacheTheme(), o.cacheStyles(), this.getPath("ss")),
				a = [],
				l = e ? this.getSI(this.getFileText(e)) : [];
			return o.getPathSheets().forEach(function(t, e) {
				var n, i;
				(!r || -1 < r.indexOf(e) || -1 < r.indexOf(t.name)) && (i = o.getFileText(t.path), n = o.match(i, /<sheetData.*?>([\s\S]*?)<\/sheetData>/, 1), i = o.getWorkSheet(i, n, l, t.name, e + 1), t.hidden && (i.hidden = !0), a.push(i))
			}), delete o.files, {
				sheets: a,
				activeId: o.activeId
			}
		},
		getWorkSheet: function(t, e, n, i, r) {
			var o, a, l, s, d, c, u, h, f, p, g, m, v, w, x, y, C = this,
				r = C.pxml("xl/worksheets/_rels/sheet" + r + ".xml.rels"),
				b = C.getComment(r),
				I = C.getLinks(t, r),
				q = [],
				_ = pq.toNumber,
				R = C.getFormula(C),
				D = pq.formulas,
				M = pq.isDateFormat,
				T = C.getMergeCells(t),
				S = e.match(/<row[^<]*?\/>|<row[\s\S]*?<\/row>/g) || [],
				e = C.getCols(t),
				k = {},
				E = ["fontSize", "font", "color", "bgColor", "format", "align", "valign", "bold", "underline", "italic"],
				F = 0,
				$ = S.length;
			for (e.forEach(function(t, e) {
					k[t.indx || e] = t
				}); F < $; F++) {
				for (o in l = {
						cells: []
					}, m = S[F], w = (h = C.attr(m)).r, h.customHeight && (l.htFix = 1.5 * h.ht), x = (s = h.s) ? C.getStyle(s) : {}) l[o] = x[o];
				(v = w ? w - 1 : F) !== F && (l.indx = v), h.hidden && (l.hidden = !0);
				for (var P, A = 0, H = (P = m.match(/(<c[^<]*?\/>|<c[\s\S]*?<\/c>)/gm) || []).length; A < H; A++) {
					if (u = P[A], d = (f = C.attr(u)).t, u = C.match(u, /<c.*?>([\s\S]*?)(<\/c>)?$/, 1), a = {}, "inlineStr" == d ? y = (y = u.match(/<t><!\[CDATA\[([\s\S]*?)\]\]><\/t>/)) ? y[1] : (y = u.match(/<t>([\s\S]*?)<\/t>/), pq.unescapeXml(y[1])) : null != (y = C.match(u, /<v>(.*?)<\/v>/, 1) || void 0) && (y = "s" == d ? n[y] : "str" == d ? pq.unescapeXml(y) : "b" == d ? "1" == y : D.VALUE(y)), (d = f.r) ? c = _(c = d.replace(/\d+/, "")) : (c = A, d = pq.toLetter(c) + (v + 1)), b[d] && (a.comment = b[d]), I[d] && (a.link = I[d]), void 0 !== y && (a.value = y), c !== A && (a.indx = c), (d = R(u, v, c)) && (a.formula = pq.unescapeXml(d)), s = f.s, g = k[c] || {}, s = s && this.getStyle(s)) {
						for (o in s) p = s[o], g[o] !== p && l[o] !== p && (a[o] = p);
						u = a.format, null != y && !d && u && M(u) && (a.value = D.TEXT(y, "m/d/yyyy"))
					}
					E.forEach(function(t) {
						!g[t] && !l[t] || s && s[t] || (a[t] = "")
					}), l.cells.push(a)
				}
				q.push(l)
			}
			i = {
				rows: q,
				name: i,
				pics: C.getPic(t, r)
			}, r = C.getFrozen(t);
			return T.length && (i.mergeCells = T), e.length && (i.columns = e), r.r && (i.frozenRows = r.r), r.c && (i.frozenCols = r.c), i
		},
		Import: function(n, i) {
			function r(t, e) {
				i(o[l ? "getCsv" : "getWorkBook"](t, l ? n.separator : n.type || e, n.sheets))
			}
			var o = this,
				t = n.file,
				e = n.content,
				a = n.url,
				l = "csv" == (a || (t || {}).name || "").slice(-3).toLowerCase() || n.csv;
			a ? (a += "?" + Math.random(), window.Uint8Array ? pq.xmlhttp(a, l ? "text" : "arraybuffer", r) : JSZipUtils.getBinaryContent(a, function(t, e) {
				r(e, "binary")
			})) : t ? pq.fileRead(t, l ? "readAsText" : "readAsArrayBuffer", r) : e && r(e)
		},
		match: function(t, e, n) {
			t = t.match(e);
			return t ? t[n] : ""
		},
		preDefFormats: {
			0: "",
			1: "0",
			2: "0.00",
			3: "#,##0",
			4: "#,##0.00",
			5: "$#,##0_);($#,##0)",
			6: "$#,##0_);[Red]($#,##0)",
			7: "$#,##0.00_);($#,##0.00)",
			8: "$#,##0.00_);[Red]($#,##0.00)",
			9: "0%",
			10: "0.00%",
			11: "0.00E+00",
			12: "# ?/?",
			13: "# ??/??",
			14: "m/d/yyyy",
			15: "d-mmm-yy",
			16: "d-mmm",
			17: "mmm-yy",
			18: "h:mm AM/PM",
			19: "h:mm:ss AM/PM",
			20: "h:mm",
			21: "h:mm:ss",
			22: "m/d/yyyy h:mm",
			37: "#,##0_);(#,##0)",
			38: "#,##0_);[Red](#,##0)",
			39: "#,##0.00_);(#,##0.00)",
			40: "#,##0.00_);[Red](#,##0.00)",
			45: "mm:ss",
			46: "[h]:mm:ss",
			47: "mm:ss.0",
			48: "##0.0E+0",
			49: "@"
		},
		readPaths: function() {
			var t, e = this.files,
				o = this.pxmlstr(e["[Content_Types].xml"].asText()),
				n = this.paths = {
					wb: "sheet.main",
					ws: "worksheet",
					st: "styles",
					ss: "sharedStrings",
					th: "theme"
				};
			for (t in n) n[t] = o.find('[ContentType$="' + n[t] + '+xml"]').attr("PartName");
			for (t in e)
				if (/workbook.xml.rels$/.test(t)) {
					n.wbrels = t;
					break
				} var a = g(this.getFileTextFromKey("wbrels")),
				e = g(this.getFileTextFromKey("wb")),
				l = this.pathSheets = [];
			this.activeId = +e.find("workbookView").attr("activeTab") || null, e.find("sheet").each(function(t, e) {
				var e = g(e),
					n = e.attr("r:id"),
					i = e.attr("name"),
					r = a.find('[Id="' + n + '"]').attr("Target"),
					r = o.find('Override[PartName$="' + r + '"]').attr("PartName");
				l.push({
					name: i,
					rId: n,
					path: r,
					hidden: "hidden" == e.attr("state")
				})
			})
		}
	}
}(jQuery), ! function(J) {
	var tt = J.paramquery,
		t = tt._pqGrid.prototype,
		e = (t.exportExcel = function(t) {
			return (t = t || {}).format = "xlsx", this.exportData(t)
		}, t.exportCsv = function(t) {
			return (t = t || {}).format = "csv", this.exportData(t)
		}, t.exportData = function(t) {
			return new e(this, t).Export(t)
		}, tt.cExport = function(t) {
			this.that = t
		});
	e.prototype = J.extend({
		copyStyle: function(n, i, r, o, a) {
			o = o || {}, a = a || {};

			function l(t) {
				var e = i[t];
				if (e && o[t] != e) return e
			}

			function t(t) {
				var e = r[t];
				if (e && a[t] != e) return e
			}
			var e, s;
			i && (i = pq.styleObj(i), (e = l("background-color")) && (n.bgColor = e), (e = l("font-size")) && (n.fontSize = parseFloat(e)), (e = l("color")) && (n.color = e), (e = l("font-family")) && (n.font = e), (e = l("font-weight")) && (n.bold = "bold" == e), (e = l("white-space")) && (n.wrap = "normal" == e), (e = l("font-style")) && (n.italic = "italic" == e), (e = l("text-decoration")) && (n.underline = "underline" == e), s = l("border"), ["left", "right", "top", "bottom"].forEach(function(t) {
				var e;
				((e = l("border-" + t)) || (e = s)) && ((n.border = n.border || {})[t] = e)
			})), r && ((e = t("align")) && (n.align = e), (e = t("valign")) && (n.valign = e))
		},
		getOCM: function(t, e, n) {
			for (var i, r, o = n || this.that.options.colModel, a = [], l = !!e && void 0, s = o.length, d = 0; d < s; d++)(i = (r = o[d]).colModel) && i.length ? (i = this.getOCM(t, e, i)).length && a.push(Object.assign({}, r, {
				colModel: i,
				hidden: l,
				collapsible: e ? void 0 : {}
			})) : t(r) || a.push(Object.assign({}, r, {
				hidden: l
			}));
			return a
		},
		Export: function(t) {
			t.workbook && "xlsx" == t.format && (t.format = "wb");
			var e, n, i = this.that,
				r = t.format,
				o = "xlsx" == r || "wb" == r,
				a = [],
				l = {
					sheets: a
				};
			if (!1 === i._trigger("beforeExport", null, t)) return !1;
			if (n = this._Export(t), o ? a[0] = n : n && (l = n.content), o) {
				if (!1 === i._trigger("workbookReady", null, {
						workbook: l
					})) return l;
				if ("wb" == r) return l;
				t.workbook = l, e = pq.excel.exportWb(t)
			} else e = l;
			return i._trigger("exportData", null, t), e
		},
		_Export: function(t) {
			function n(t) {
				return u && t.hidden || t.skipExport || p && m && !w[t.dataIndx]
			}

			function i(t) {
				return h && t.pq_hidden || p && (g && !t.pq_rowselect || m && !v[t.pq_ri])
			}
			var e = this,
				r = e.that,
				o = r.iMerge,
				a = r.options,
				l = e.skipCI = [],
				s = e.hcForHead = r.headerCells,
				d = s.length - 1,
				c = e.skipRI = [],
				u = e.xHCols = t.skipHiddenCols,
				h = e.xHRows = t.skipHiddenRows,
				f = r.Selection(),
				p = t.selection,
				g = "row" == p,
				m = p && !g,
				v = [],
				w = {},
				x = r.colModel;
			p && m && (f.eachRow(function(t, e) {
				v[e] = !0
			}), f.eachCol(function(t) {
				w[t.dataIndx] = !0
			})), x.forEach(function(t, e) {
				n(t) && (l[e] = !0)
			}), o.init(n, i), l.length && d && ((s = e.hcForHead = r.Columns().getHeaderCells(e.getOCM(n, u))[0])[s.length - 1] = x);
			var f = a.groupModel,
				d = "remote" == a.pageModel.type,
				x = r.colModel,
				y = a.treeModel,
				f = (e.curPage = f.on && f.dataIndx.length || d || y.dataIndx && y.summary) ? r.pdata : a.dataModel.data,
				f = a.summaryData ? f.concat(a.summaryData) : f,
				d = !t.noheader,
				y = t.format;
			return (h || p) && f.forEach(function(t, e) {
				i(t) && (c[e] = !0)
			}), d = "xlsx" == y || "wb" == y ? e.getWorksheet(t, f, x, d, s) : "json" == y ? {
				content: e.getJsonContent(t, f)
			} : (x = d ? e.getHead(t) : [], s = e.getBody(t, f), {
				content: "js" == y ? {
					head: x,
					body: s
				} : (t.grid = r, pq[pq.camelCase("export-" + y)](x, s, t))
			}), o.init(), d && (d.name = t.sheetName || a.title), d
		},
		getHead: function(t) {
			for (var e = this.that, n = t.eachCellHead, i = t.eachRowHead, r = this.hcForHead, o = r.length, a = [], l = this.skipCI, s = 0, d = 0; d < o; d++) {
				for (var c, u, h, f, p, g, m, v = r[d], w = null, x = [], y = d == o - 1, C = 0, b = v.length; C < b; C++) y && l[C] ? s++ : (h = (u = v[C]).dataIndx, f = u.o_colspan, p = u.rowSpan, g = w == u ? g + 1 : 0, (m = 0 < d ? r[d - 1][C - s] : null) && (u == m || h && h == m.dataIndx) || g ? x.push({
					text: "",
					empty: !0
				}) : (h = {
					text: this.getTitle(u, C),
					alignment: (w = u).halign || u.align,
					valign: u.hvalign,
					style: "header"
				}, y || (h.rowSpan = p, h.colSpan = f), (m = pq.styleStr(u.styleHead)) && (h.css = m), n && n.call(e, h, C, d, u), x.push(h)));
				c = {
					cells: x
				}, i && i.call(e, c, d), a.push(c)
			}
			return a
		},
		getVars: function() {
			var t = this.that;
			return {
				remotePage: "remote" == t.options.pageModel.type,
				offset: t.riOffset,
				iGV: t.iRenderB
			}
		},
		getBody: function(t, e) {
			for (var n, i, r, o, a, l, s, d, c, u, h, f, p, g, m, v, w, x, y, C = this.that, b = C.options.rowInit, I = e.length, q = this.getVars(), _ = t.linkStyle, R = q.remotePage, D = q.offset, M = C.iMerge, T = C.colModel, $ = this.skipCI, H = this.skipRI, O = T.length, S = q.iGV, k = t.render, E = [], F = t.eachCell, P = t.eachRow, A = 0; A < I; A++)
				if (!H[A]) {
					for (o = (p = e[A]).pq_rowprop || {}, a = p.pq_cellprop || {}, m = p.pq_cellstyle || {}, i = [], f = {
							rowIndx: g = R ? A + D : A,
							rowIndxPage: g - D,
							rowData: p,
							Export: !0
						}, h = [pq.styleStr(p.pq_rowstyle)], b && (s = (b.call(C, f) || {}).style) && h.push(pq.styleStr(s)), h = h.join(""), r = 0; r < O; r++)
						if (!$[r]) {
							if (v = "", l = a[w = (d = T[r]).dataIndx] || {}, x = y = "", (u = [pq.styleStr(d.style)]).push(h), u.push(pq.styleStr(m[w])), M.ismergedCell(g, r)) {
								if (!(c = M.isRootCell(g, r))) {
									i.push({
										text: "",
										empty: !0
									});
									continue
								}(v = M.getRootCellO(g, r)).Export = !0, y = c.colspan, x = c.rowspan, c = this.getRenderVal(v, k, S)
							} else f.colIndx = r, f.column = d, f.dataIndx = w, c = this.getRenderVal(f, k, S);
							v = c[0], u.push(pq.styleStr(c[1])), w = {
								text: v = null == v ? "" : v,
								style: "body",
								alignment: l.align || o.align || d.align,
								valign: l.valign || o.valign || d.valign,
								rowSpan: x,
								colSpan: y
							}, (s = this.getLink(l, v)) && (w.text = s[0], w.link = s[1], w.html = s[2], _ && u.unshift(_)), w.css = u.join(""), F && F.call(C, w, r, g, d, p), i.push(w)
						} n = {
						cells: i
					}, P && P.call(C, n, g, p, E), E.push(n)
				} return E
		},
		getJsonContent: function(t, e) {
			return t.nostringify ? e : JSON.stringify(e, t.nopqdata ? function(t, e) {
				if (0 !== (t + "").indexOf("pq_")) return e
			} : null, t.nopretty ? null : 2)
		},
		getMC: function(t, e, o) {
			var n = this.that,
				a = this.skipCI,
				l = this.skipRI,
				e = n.iMerge.getMergeCells(e, t.length),
				s = [],
				i = 0,
				d = [],
				r = 0;
			return e.length && (a.length && n.colModel.forEach(function(t, e) {
				a[e] && i++, s[e] = i
			}), l.length && t.forEach(function(t, e) {
				l[e] && r++, d[e] = r
			})), e.reduce(function(t, e) {
				var n = e.c1,
					i = e.c2,
					r = e.r1,
					e = e.r2,
					n = n - (s[n] || 0) + (a[n] ? 1 : 0),
					r = r - (d[r] || 0) + (l[r] ? 1 : 0);
				return i -= s[i] || 0, e -= d[e] || 0, (n < i && r <= e || n <= i && r < e) && t.push({
					r1: r + o,
					r2: e + o,
					c1: n,
					c2: i
				}), t
			}, [])
		},
		getXlsMergeCells: function(t, e) {
			for (var n, i = [], r = pq.toLetter, o = (t = t.concat(e)).length, a = 0; a < o; a++) n = r((n = t[a]).c1) + (n.r1 + 1) + ":" + r(n.c2) + (n.r2 + 1), i.push(n);
			return i
		},
		getXlsCols: function(t, e) {
			for (var n, i, r, o = e.length, a = this.that, l = this.skipCI, s = t.eachCol, d = 0, c = [], u = 0, h = pq.excel.colWidth; u < o; u++) l[u] ? d++ : (r = +((i = e[u])._width || h).toFixed(2), this.copyStyle(n = {}, i.style, i), r !== h && (n.width = r), i.hidden && (n.hidden = !0), pq.isEmpty(n) || (c.length !== u - d && (n.indx = u - d), s && s.call(a, n, u, i), c.push(n)));
			return c
		},
		getXlsHeader: function(t, e, n, i) {
			for (var r, o = this.that, a = t.eachCellHead, l = this.skipCI, n = (e = this.hcForHead).length, s = 0, d = t.eachRowHead, c = [], u = 0; u < n; u++) {
				for (var h = e[u], f = [], p = u == n - 1, g = 0, m = h.length; g < m; g++)
					if (p && l[g]) s++;
					else {
						var v = h[g],
							w = v.dataIndx,
							x = v.o_colspan,
							y = v.rowSpan,
							C = this.getTitle(v, g),
							b = 0 < u ? e[u - 1][g - s] : null;
						if (b && (v == b || w && w == b.dataIndx)) C = "";
						else if (0 < g && v == e[u][g - 1]) {
							if (r + x <= g) continue;
							C = ""
						} else !p && (1 < x || 1 < y) && (r = g, i.push({
							r1: u,
							c1: g,
							r2: u + y - 1,
							c2: g + x - 1
						}));
						w = {
							value: C,
							align: v.halign || v.align,
							valign: v.hvalign
						}, (b = v.styleHead) && this.copyStyle(w, b), a && a.call(o, w, g, u, v), f.push(w)
					} h = {
					cells: f
				}, d && d.call(o, h, u), c.push(h)
			}
			return c
		},
		getXlsBody: function(t, e, n) {
			for (var i, r, o, a, l, s, d, c, u, h, f, p, g, m, v, w, x, y, C, b, I, q, _, R, D, M, $, T, S = this, k = S.that, H = S.skipRI || [], O = S.skipCI || [], V = t.linkStyle, N = k.colModel, L = N.length, B = t.eachCell, j = t.eachRow, z = k.options, U = z.rowInit, E = [], W = tt.cFormulas.shiftRC(k), G = e.length, F = S.getVars(), K = F.remotePage, X = F.offset, Q = F.iGV, P = k.iMerge, Y = t.render, Z = 0, A = 0; A < G; A++)
				if (H[A]) Z++;
				else {
					for (y = (h = e[A]).pq_cellattr, I = h.pq_cellprop || {}, v = h.pq_rowprop || {}, _ = h.pq_cellstyle || {}, u = [], l = {
							rowIndx: f = K ? A + X : A,
							rowIndxPage: f - X,
							rowData: h,
							Export: !(M = 0)
						}, i = 0; i < L; i++) O[i] ? M++ : (g = (a = N[i]).style, R = _[p = (m = a).dataIndx] || "", q = I[p] || {}, r = C = h[p], o = k.getFormula(h, p), T = !1, P.ismergedCell(f, i) && P.isRootCell(f, i) && ((D = P.getRootCellO(f, i)).Export = !0, r = (D = S.getRenderVal(D, Y, Q))[0], s = D[1], c = D[2], d = D[3], T = !0), T || o || (l.colIndx = i, l.column = a, l.dataIndx = p, r = (D = S.getRenderVal(l, Y, Q))[0], s = D[1], c = D[2], d = D[3]), T = z.format.call(k, h, a, q, v), x = {}, pq.isStr(T) && (pq.isDateFormat(T) ? (r !== C && J.datepicker.formatDate(T, new Date(C)) === r && (r = C), T = pq.juiToExcel(T)) : r !== C && pq.formatNumber(C, T) === r && (r = C), x.format = T), void 0 !== r && (x.value = r), y && (C = y[p]) && ((b = C.title) && (x.comment = b), (b = C.style) && S.copyStyle(x, b)), (b = S.getLink(q, r)) && (x.value = b[0], x.link = b[1], V && (R = V + R)), S.copyStyle(x, R, q, g, m), S.copyStyle(x, s, c, g, m), d && (x.comment = d), o && (n && (o = W(o, 0, n)), x.formula = o), pq.isEmpty(x) || (x.dataIndx = p, u.length !== i - M && (x.indx = i - M), u.push(x), B && B.call(k, x, i, f, a, h)));
					w = {}, u.length && (w.cells = u), h.pq_hidden && (w.hidden = !0), h.pq_htfix && (w.htFix = h.pq_ht), S.copyStyle(w, h.pq_rowstyle, v), U && (b = (U.call(k, l) || {}).style) && S.copyStyle(w, b), pq.isEmpty(w) || (E.length !== ($ = A + n - Z) && (w.indx = $), j && j.call(k, w, f, h, E), E.push(w))
				} return E
		},
		getLink: function(t, e) {
			var n;
			return e && pq.isStr(e) && (n = pq.isLink(e)) ? [n[3], n[1] || n[2], e] : (n = (t || {}).link) ? [e, n] : void 0
		},
		getWorksheet: function(t, e, n, i, r) {
			var n = this.getXlsCols(t, n),
				o = [],
				a = this.that,
				l = a.options,
				s = l.freezeCols,
				d = r.length,
				c = i ? d : 0,
				u = c + (l.freezeRows || 0),
				i = i ? this.getXlsHeader(t, r, d, o) : [],
				r = this.getMC(e, this.curPage, c),
				d = this.getXlsMergeCells(o, r),
				o = this.getXlsBody(t, e, c),
				r = {
					columns: n,
					rows: i.concat(o)
				};
			return l.rtl && (r.rtl = !0), d.length && (r.mergeCells = d), r.headerRows = i.length, u && (r.frozenRows = u), s && (r.frozenCols = s), r.pics = a.iPic.pics, r
		}
	}, pq.mixin.render)
}(jQuery), ! function(M) {
	var r, i = pq.excel = {
		_tmpl: {
			rels: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>'
		},
		eachRow: function(t, e) {
			for (var n = t.rows, i = 0, r = n.length; i < r; i++) e(n[i], i)
		},
		exportWb: function(t) {
			var e = t.workbook,
				d = t.replace,
				c = this,
				n = c._tmpl,
				i = e.sheets,
				r = i.length,
				u = [],
				h = [],
				o = new JSZip,
				f = {},
				p = o.folder("xl");
			return o.file("_rels/.rels", n.rels), o.file("xl/_rels/workbook.xml.rels", c.getWBookRels(r)), i.forEach(function(t, e) {
				var n, i, r = c.getCols(t.columns),
					o = t.pics || [],
					a = o.length,
					e = e + 1,
					l = c.getFrozen(t.frozenRows, t.frozenCols, t.rtl),
					s = c.getBody(t.rows || [], t.columns || []),
					t = c.getMergeCells(t.mergeCells);
				d && (s = s.replace.apply(s, d)), n = c.comments, n = !pq.isEmpty(n), i = !pq.isEmpty(c.links), p.file("worksheets/sheet" + e + ".xml", c.getSheet(l, r, s, t, n, a, e)), n && (u.push(e), p.file("comments" + e + ".xml", c.getComment()), p.file("drawings/vmlDrawing" + e + ".vml", c.getVml())), a && (c.addPics(p, o, e), o.forEach(function(t) {
					f[t.name.split(["."])[1]] = 1
				}), h.push(e)), (n || a || i) && p.file("worksheets/_rels/sheet" + e + ".xml.rels", c.getSheetRel(e, n, a))
			}), o.file("[Content_Types].xml", c.getContentTypes(r, u, h, f)), p.file("workbook.xml", c.getWBook(i, e.activeId)), p.file("styles.xml", c.getStyle()), o.generate({
				type: t.type || "blob",
				compression: "DEFLATE"
			})
		},
		addPics: function(c, t, e) {
			var u, h, f, p, g;
			t.length && (u = ['<xdr:wsDr xmlns:xdr="http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:c="http://schemas.openxmlformats.org/drawingml/2006/chart" xmlns:cx="http://schemas.microsoft.com/office/drawing/2014/chartex" xmlns:cx1="http://schemas.microsoft.com/office/drawing/2015/9/8/chartex" xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006" xmlns:dgm="http://schemas.openxmlformats.org/drawingml/2006/diagram" xmlns:x3Unk="http://schemas.microsoft.com/office/drawing/2010/slicer" xmlns:sle15="http://schemas.microsoft.com/office/drawing/2012/slicer">'], h = ['<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'], f = 1, p = parseInt, g = function(t) {
				return ["<xdr:col>", t[0], "</xdr:col><xdr:colOff>", p(9500 * t[1]), "</xdr:colOff><xdr:row>", t[2], "</xdr:row><xdr:rowOff>", p(9500 * t[3]), "</xdr:rowOff>"].join("")
			}, t.forEach(function(t, e) {
				var n = t.from,
					i = t.name,
					r = "rId" + f++,
					o = t.to,
					a = o && !!o.length,
					l = a ? "two" : "one",
					s = p(9500 * t.cx),
					d = p(9500 * t.cy);
				u.push("<xdr:", l, "CellAnchor>", "<xdr:from>", g(n), "</xdr:from>", a ? "<xdr:to>" + g(o) + "</xdr:to>" : '<xdr:ext cx="' + s + '" cy="' + d + '"/>', '<xdr:pic><xdr:nvPicPr><xdr:cNvPr id="', t.id, '" name="Picture ', e + 1, '" descr="', i, '"/>', '<xdr:cNvPicPr preferRelativeResize="0"/></xdr:nvPicPr>', '<xdr:blipFill><a:blip cstate="print" r:embed="', r, '"/><a:stretch><a:fillRect/></a:stretch></xdr:blipFill>', '<xdr:spPr><a:prstGeom prst="rect"><a:avLst/></a:prstGeom><a:noFill/></xdr:spPr>', '</xdr:pic><xdr:clientData fLocksWithSheet="0"/></xdr:', l, "CellAnchor>"), h.push('<Relationship Id="', r, '" Target="../media/', i, '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" />'), c.file("media/" + i, t.src.split(",")[1], {
					base64: !0
				})
			}), u.push("</xdr:wsDr>"), h.push("</Relationships>"), c.file("drawings/drawing" + e + ".xml", u.join("")), c.file("drawings/_rels/drawing" + e + ".xml.rels", h.join("")))
		},
		eachCell: function(t, a, l) {
			t.forEach(function(t, e) {
				var n, i;
				if (n = t.cells) {
					e = t.indx || e;
					for (var r = 0, o = n.length; r < o; r++) i = n[r], a(i, i.indx || r, e, l)
				} else(n = t.rows) && this.eachCell(n, a, e)
			}, this)
		},
		findIndex: function(t, e) {
			e = t.findIndex(e);
			return t[e].indx || e
		},
		getArray: function(t) {
			var n = [],
				i = this;
			return this.eachRow(t, function(t) {
				var e = [];
				t.cells.forEach(function(t) {
					e.push(i.getCell(t))
				}), n.push(e)
			}), n
		},
		getBody: function(t, e) {
			var n, i, r, o, a, l, s, d, c, u, h, f, p, g, m, v, w, x, y, C, b = {},
				I = pq.formulas,
				q = [],
				_ = this.comments = {},
				R = this.links = {},
				D = t.length;
			for ((e || []).forEach(function(t, e) {
					b[t.indx || e] = t
				}), i = 0; i < D; i++) {
				for (v = (p = (m = t[i]).cells || []).length, w = m.hidden ? 'hidden="1" ' : "", x = m.htFix ? 'customHeight="1" ht="' + m.htFix / 1.5 + '" ' : "", o = a, a = (m.indx || i) + 1, s = 'r="' + (a = 0 < i ? Math.max(a, o + 1) : a) + '"', c = this.getStyleIndx(m), q.push("<row " + w + x + s + (c = c ? ' s="' + c + '" customFormat="1"' : "") + ">"), r = 0; r < v; r++) g = (f = p[r]).value, l = f.indx || r, c = d = "", y = b[l] || {}, s = l === r ? "" : 'r="' + pq.toLetter(l) + a + '"', y = M.extend({}, y, m, f), n = "@" != (C = f.format), h = (h = f.formula) ? "<f>" + pq.escapeXml(h) + "</f>" : "", null == g ? u = "<v></v>" : n && "boolean" == typeof g ? (u = "<v>" + (g ? "1" : "0") + "</v>", d = 't="b"') : u = n && g == +g && (g + "").length == (+g + "").length ? "<v>" + g + "</v>" : n && C && I.isDate(g) ? "<v>" + I.VALUE(g) + "</v>" : (d = 't="inlineStr"', "<is><t>" + pq.escapeXml(g) + "</t></is>"), c = (c = this.getStyleIndx(y)) ? 's="' + c + '"' : "", (n = f.comment) && (_[pq.toLetter(l) + a] = n), (n = f.link) && (R[pq.toLetter(l) + a] = n), q.push("<c " + d + " " + s + " " + c + ">" + h + u + "</c>");
				q.push("</row>")
			}
			return q.join("")
		},
		getCell: function(t) {
			var e = t.format,
				t = t.value;
			return e ? pq.formulas.TEXT(t, e) : t
		},
		getCSV: function(t) {
			var n = [],
				i = this;
			return this.eachRow(t, function(t) {
				var e = [];
				t.cells.forEach(function(t) {
					e.push(i.getCell(t))
				}), n.push(e.join(","))
			}), n.join("\r\n")
		},
		getColor: (r = {}, function(t) {
			var e, n, i = r[t];
			if (i || (/^#[0-9,a,b,c,d,e,f]{6}$/i.test(t) ? n = t.replace("#", "") : (e = t.match(/^rgb\((\d{1,3}),(\d{1,3}),(\d{1,3})\)$/i)) && (n = o((+e[1]).toString(16)) + o((+e[2]).toString(16)) + o((+e[3]).toString(16))), n && 6 === n.length && (i = r[t] = "ff" + n)), i) return i;
			throw "invalid color: " + t
		}),
		_getCol: function(t, e, n, i, r, o) {
			o = o ? ' style="' + o + '"' : "", i && !r || (r = ' customWidth="1" width="' + (r = +((r = r || this.colWidth) / this.colRatio).toFixed(2)) + '"'), t.push('<col min="', e, '" max="', n, '" hidden="', i, '"', r, o, "/>")
		},
		getCols: function(t) {
			if (!t || !t.length) return "";
			var e, n, i, r, o, a, l = [],
				s = 0,
				d = 0,
				c = 0,
				u = t.length;
			for (l.push("<cols>"); c < u; c++) {
				var h = t[c],
					f = h.hidden ? 1 : 0,
					p = h.width,
					g = this.getStyleIndx(h),
					s = (h.indx || s) + 1;
				i === p && r === f && g == o && s == d + 1 ? n = s : (a && (this._getCol(l, e, n, r, i, o), e = null), n = s, null == e && (e = s)), i = p, r = f, o = g, d = s, a = !0
			}
			return this._getCol(l, e, n, r, i, o), l.push("</cols>"), l.join("")
		},
		getComment: function() {
			var t, e = [],
				n = this.comments;
			for (t in n) e.push('<comment authorId="0" ref="', t, '"><text><t xml:space="preserve">', pq.escapeXml(n[t]), "</t></text></comment>");
			return ['<?xml version="1.0" encoding="UTF-8" standalone="yes"?>', '<comments xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">', "<authors><author></author></authors>", "<commentList>", e.join(""), "</commentList></comments>"].join("")
		},
		getContentTypes: function(t, e, n, i) {
			for (var r, o = [], a = 1, l = [], s = []; a <= t; a++) o.push('<Override PartName="/xl/worksheets/sheet' + a + '.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>');
			for (r in e.forEach(function(t) {
					l.push('<Override PartName="/xl/comments', t, '.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.comments+xml" />')
				}), i) s.push('<Default Extension="' + r + '" ContentType="image/' + r + '" />');
			return n.forEach(function(t) {
				s.push('<Override PartName="/xl/drawings/drawing', t, '.xml" ContentType="application/vnd.openxmlformats-officedocument.drawing+xml"/>')
			}), ['<?xml version="1.0" encoding="UTF-8" standalone="yes"?>', '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">', '<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>', '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>', '<Default Extension="xml" ContentType="application/xml" />', '<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>', o.join(""), '<Default Extension="vml" ContentType="application/vnd.openxmlformats-officedocument.vmlDrawing" />', l.join(""), s.join(""), "</Types>"].join("")
		},
		getFillIndx: function(t) {
			var e = this.fills = this.fills || {
				length: 2
			};
			return this.getIndx(e, t)
		},
		getBorderIndx: function(t) {
			var e = this.borders = this.borders || {
				length: 1
			};
			return this.getIndx(e, JSON.stringify(t))
		},
		getFontIndx: function(t, e, n, i, r, o) {
			var a = this.fonts = this.fonts || {
				length: 1
			};
			return this.getIndx(a, (t || "") + "_" + (e || "") + "_" + (n || "") + "_" + (i || "") + "_" + (r || "") + "_" + (o || ""))
		},
		getFormatIndx: function(t) {
			var e = this.formats = this.formats || {
				length: 164
			};
			return this.numFmtIds[t] || this.getIndx(e, t)
		},
		getFrozen: function(t, e, n) {
			return ["<sheetViews><sheetView ", n ? 'rightToLeft="1"' : "", ' workbookViewId="0">', '<pane xSplit="', e = e || 0, '" ySplit="', t = t || 0, '" topLeftCell="', pq.toLetter(e) + (t + 1), '" activePane="bottomLeft" state="frozen"/>', "</sheetView></sheetViews>"].join("")
		},
		getIndx: function(t, e) {
			var n = t[e];
			return null == n && (n = t[e] = t.length, t.length++), n
		},
		getItem: function(t, e) {
			var n, i, r = t[e],
				o = 0,
				a = 0,
				l = r ? r.indx : -1;
			if (null == l || e == l) return r;
			if (0 <= (n = -1 == l ? t.length - 1 : e))
				for (;;) {
					if (20 < ++a) throw "not found";
					if ((l = (r = t[i = Math.floor((n + o) / 2)]).indx) == e) return r;
					if (e < l ? n = i : o = i == o ? i + 1 : i, o == n && i == o) break
				}
		},
		getMergeCells: function(t) {
			var e = [],
				n = 0,
				i = (t = t || []).length;
			for (e.push('<mergeCells count="' + i + '">'); n < i; n++) e.push('<mergeCell ref="', t[n], '"/>');
			return e.push("</mergeCells>"), i ? e.join("") : ""
		},
		getSheetRel: function(t, e, n) {
			var i, r = ['<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'],
				o = (e && r.push('<Relationship Id="com' + t + '" Target="../comments' + t + '.xml" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/comments" />', '<Relationship Id="vml' + t + '" Target="../drawings/vmlDrawing' + t + '.vml" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/vmlDrawing" />'), n && r.push('<Relationship Id="rId' + t + '" Target="../drawings/drawing' + t + '.xml" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/drawing"/>'), this.links),
				a = 0;
			for (i in o) a++, r.push('<Relationship Id="hid' + a + '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink" Target="' + o[i] + '" TargetMode="External"/>');
			return r.push("</Relationships>"), r.join("")
		},
		getSheet: function(t, e, n, i, r, o, a) {
			var l, s = this.links,
				d = 0,
				c = "";
			if (!pq.isEmpty(s)) {
				for (l in c = "<hyperlinks>", s) c += '<hyperlink ref="' + l + '" r:id="hid' + ++d + '"/>';
				c += "</hyperlinks>"
			}
			return ['<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">', t, e, "<sheetData>", n, "</sheetData>", i, c, o ? '<drawing r:id="rId' + a + '" />' : "", r ? '<legacyDrawing r:id="vml' + a + '" />' : "", "</worksheet>"].join("")
		},
		getStyleIndx: function(t) {
			var e = t.format,
				n = t.bgColor,
				i = t.color,
				r = t.font,
				o = t.fontSize,
				a = t.align,
				l = t.valign,
				s = t.wrap,
				d = t.bold,
				c = t.italic,
				u = t.underline,
				t = t.border;
			if (e || n || i || r || o || a || l || s || d || c || u || t) return e = e ? this.getFormatIndx(e) : "", n = n ? this.getFillIndx(n) : "", t = t ? this.getBorderIndx(t) : "", e = e + "_" + n + "_" + (i || r || o || d || c || u ? this.getFontIndx(i, r, o, d, c, u) : "") + "_" + (a || "") + "_" + (l || "") + "_" + (s || "") + "_" + t, n = this.styles = this.styles || {
				length: 1
			}, this.getIndx(n, e)
		},
		getStyle: function() {
			var t, e, n, i, r, o, a, l, s, d, c, u, h, f, p, g = this,
				m = g.formats,
				v = g.fills,
				w = g.fonts,
				x = g.borders,
				y = ["left", "right", "top", "bottom"],
				C = g.styles,
				b = [],
				I = [],
				q = [],
				_ = [],
				R = ['<xf numFmtId="0" applyNumberFormat="1"/>'],
				D = {
					"1px solid": "thin",
					"2px solid": "medium",
					"3px solid": "thick",
					"3px double": "double",
					"1px dotted": "dotted",
					"1px dashed": "dashed"
				};
			if (m) {
				for (p in delete m.length, m) {
					var M = pq.escapeXmlAttr(p);
					b.push('<numFmt numFmtId="' + m[p] + '" formatCode="' + M + '"/>')
				}
				delete g.formats
			}
			if (v) {
				for (p in delete v.length, v) I.push('<fill><patternFill patternType="solid"><fgColor rgb="' + this.getColor(p) + '"/></patternFill></fill>');
				delete g.fills
			}
			if (w) {
				for (p in delete w.length, w) t = (a = p.split("_"))[0] ? '<color rgb="' + this.getColor(a[0]) + '" />' : "", n = a[1] ? '<name val="' + pq.escapeXmlAttr(a[1]) + '"/>' : "", e = a[2] ? '<sz val="' + a[2] + '"/>' : "", i = a[3] ? "<b/>" : "", r = a[4] ? "<i/>" : "", o = a[5] ? "<u/>" : "", q.push("<font>", i, r, o, e, t, n, '<family val="2"/></font>');
				delete g.fonts
			}
			if (x) {
				for (p in delete x.length, x) {
					var T = JSON.parse(p);
					_.push("<border>"), y.forEach(function(t) {
						T[t] && (a = T[t].split(" "), _.push("<" + t + ' style="' + D[[a[0], a[1]].join(" ")] + '"><color rgb="' + g.getColor(a[2]) + '"/></' + t + ">"))
					}), _.push("</border>")
				}
				delete g.borders
			}
			if (C) {
				for (p in delete C.length, C) l = (a = p.split("_"))[0], s = a[1], d = a[2], c = a[3], u = a[4], h = a[5], f = a[6], u = u ? ' vertical="' + u + '" ' : "", h = h ? ' wrapText="1" ' : "", R.push("<xf " + (l ? ' applyNumberFormat="1" numFmtId="' + l + '"' : "") + (s ? ' applyFill="1" fillId="' + s + '" ' : "") + (d ? ' applyFont="1" fontId="' + d + '" ' : "") + (f ? ' applyBorder="1" borderId="' + f + '"' : "") + ((c = c ? ' horizontal="' + c + '" ' : "") || u || h ? ' applyAlignment="1"><alignment ' + c + u + h + "/></xf>" : "/>"));
				delete this.styles
			}
			return b = b.join("\n"), R = R.join("\n"), I = I.join("\n"), ['<?xml version="1.0" encoding="UTF-8" standalone="yes"?>', '<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">', "<numFmts>", b, "</numFmts>", "<fonts>", '<font><sz val="11"/><color theme="1"/><name val="Calibri"/><family val="2"/><scheme val="minor"/></font>', q = q.join(""), "</fonts>", '<fills><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill>', I, "</fills>", "<borders><border><left/><right/><top/><bottom/><diagonal/></border>", _ = _.join("\n"), "</borders>", '<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/>', "</cellStyleXfs>", "<cellXfs>", R, "</cellXfs>", '<cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>', '<dxfs count="0"/><tableStyles count="0" defaultTableStyle="TableStyleMedium9" defaultPivotStyle="PivotStyleLight16"/>', "</styleSheet>"].join("")
		},
		getVml: function() {
			var t, e = [];
			for (t in this.comments) {
				var n = t.match(/([A-Z]+)(\d+)/),
					i = pq.toNumber(n[1]),
					n = n[2] - 1;
				e.push('<v:shape id="1" type="#0" style="position:absolute;margin-left:259.25pt;margin-top:1.5pt;width:108pt;height:59.25pt;z-index:1;visibility:hidden" fillcolor="#ffffe1" o:insetmode="auto"><v:fill color2="#ffffe1"/><v:shadow on="t" color="black" obscured="t"/><v:path o:connecttype="none"/><v:textbox style="mso-direction-alt:auto"><div style="text-align:right"></div></v:textbox><x:ClientData ObjectType="Note"><x:MoveWithCells/><x:SizeWithCells/><x:Anchor>1, 15, 0, 2, 3, 31, 4, 1</x:Anchor><x:AutoFill>False</x:AutoFill>', "<x:Row>", n, "</x:Row>", "<x:Column>", i, "</x:Column></x:ClientData></v:shape>")
			}
			return ['<xml xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel"><o:shapelayout v:ext="edit"><o:idmap v:ext="edit" data="1"/></o:shapelayout>', '<v:shapetype id="0" coordsize="21600,21600" o:spt="202" path="m,l,21600r21600,l21600,xe"><v:stroke joinstyle="miter"/><v:path gradientshapeok="t" o:connecttype="rect"/></v:shapetype>', e.join(""), "</xml>"].join("")
		},
		getWBook: function(t, e) {
			return ['<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">', "<bookViews><workbookView " + (0 <= e ? "activeTab='" + e + "'" : "") + " /></bookViews><sheets>", t.map(function(t, e) {
				e++;
				var n = t.name;
				return ["<sheet ", t.hidden ? 'state="hidden"' : "", ' name="', n ? pq.escapeXml(n) : "sheet" + e, '" sheetId="', e, '" r:id="rId', e, '"/>'].join("")
			}).join(""), "</sheets></workbook>"].join("")
		},
		getWBookRels: function(t) {
			for (var e = [], n = 1; n <= t; n++) e.push('<Relationship Id="rId' + n + '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet' + n + '.xml"/>');
			return ['<?xml version="1.0" encoding="UTF-8" standalone="yes"?>', '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">', e.join(""), '<Relationship Id="rId', n, '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>', "</Relationships>"].join("")
		},
		importXl: function() {
			var t = pq.excelImport;
			return t.Import.apply(t, arguments)
		},
		SpreadSheet: function(t) {
			var e, n = i.SpreadSheet;
			if (this instanceof n == 0) return new n(t);
			for (e in t) this[e] = t[e]
		}
	};

	function o(t) {
		return 1 === t.length ? "0" + t : t
	}
	i.colRatio = 7.1, i.colWidth = 8.43 * i.colRatio, i.numFmtIds = function() {
		var t, e = pq.excelImport.preDefFormats,
			n = {};
		for (t in e) n[e[t]] = t;
		return n
	}(), i.SpreadSheet.prototype = {
		getCell: function(t, e) {
			var n = this.rows || [],
				n = i.getItem(n, t) || {
					cells: []
				};
			return i.getItem(n.cells, e)
		}
	}
}(jQuery), ! function(t) {
	var e = t.paramquery,
		u = (e.pqGrid.defaults.formulasModel = {
			on: !0
		}, e.pqGrid.prototype.getFormula = function(t, e) {
			t = this.iFormulas.getFnW(t, e);
			return t ? t.fn : void 0
		}, t(document).on("pqGrid:bootup", function(t, e) {
			var n, e = e.instance;
			e.options.formulasModel.on && (n = e.iFormulas = new u(e)), e.Formulas = function() {
				return n
			}
		}), e.cFormulas = function(t) {
			var e = this;
			e.that = t, e.fn = {}, e.tabNames = {}, t.on("dataReadyDone", e.onDataReadyDone.bind(e)).on("colMove colAdd colRemove", e.onColumnAMR.bind(e)).on("beforeValidateDone", e.onBeforeValidateDone.bind(e)).on("autofillSeries", e.onAutofill.bind(e)).on("editorBegin", e.onEditorBegin.bind(e)).on("editorEnd", e.onEditorEnd.bind(e)).on("editorKeyUp editorClick", e.onEditorKeyUp.bind(e)).on(!0, "change", e.onChange.bind(e)).on("tabChange", e.onTabChange.bind(e)).on("tabRename", e.onTabRename.bind(e))
		});
	t.extend(u, {
		deString: function(n, t, i) {
			var r = [];
			return n = t(n = n.replace(/(?:^|[^"]+)"(([^"]|"{2})+)"(?=([^"]+|$))/g, function(t, e) {
				var n = t.indexOf('"' + e + '"');
				return r.push(e), t.slice(0, n) + "#" + (r.length - 1) + "#"
			})), r.forEach(function(t, e) {
				i && (t = t.replace(/""/g, '\\"')), n = n.replace("#" + e + "#", '"' + t + '"')
			}), n
		},
		reSheet: "(?:(?:(?:'(?:[^']|'')+')|(?:[^:\\(\\)\\+\\-',!]+))!)?",
		selectExp: function(t, e) {
			var n, i = t.slice(0, e).replace(/"[^"]*"/g, "");
			if (!/"[^"]+$/.test(i) && (t = t.slice(e), (e = i.match(/.*?([a-z0-9:$]+)$/i)) && (n = "" === t ? [] : t.match(/^([a-z0-9:$]+)?.*/i)))) return (e[1] + (null == n[1] ? "" : n[1])).replace(/\$/g, "").toUpperCase()
		},
		shiftRC: function(t) {
			var i = u,
				r = t ? t.get_p_data().length - 1 : 0,
				o = t ? t.colModel.length - 1 : 0;
			return function(t, e, n) {
				return e && (t = i.shiftC(t, e, o)), t = n ? i.shiftR(t, n, r) : t
			}
		},
		getTab: function(t) {
			t = t.slice(0, t.length - 1).replace(/''/g, "'");
			return t = "'" == t[0] ? t.slice(1, t.length - 1) : t
		},
		shiftR: function(t, l, s, e) {
			function d(t) {
				return e[u.getTab(t)].pdata.length - 1
			}
			var n = u.reSheetC,
				i = new RegExp(n + "(\\$?)([A-Z]+)(\\$?)([\\d]+(?!!))", "g"),
				r = new RegExp(n + "(\\$?)([0-9]+):(\\$?)([0-9]+)", "g");
			return u.deString(t, function(t) {
				return t.replace(i, function(t, e, n, i, r, o) {
					return r ? t : (r = +o + l - 1, s = e ? d(e) : s, (e || "") + n + i + ((r = r < 0 ? 0 : s && s < r ? s : r) + 1))
				}).replace(r, function(t, e, n, i, r, o) {
					var a;
					return s = e ? d(e) : s, (e || "") + n + (i = n ? i : (a = (a = +i + l - 1) < 0 ? 0 : s && s < a ? s : a) + 1) + ":" + r + (o = r ? o : (a = (a = +o + l - 1) < 0 ? 0 : s && s < a ? s : a) + 1)
				})
			})
		},
		shiftC: function(t, l, s, e) {
			function d(t) {
				return e[u.getTab(t)].colModel.length - 1
			}
			var n = u.reSheetC,
				i = new RegExp(n + "(\\$?)([A-Z]+)(\\$?)([\\d]+)", "g"),
				r = new RegExp(n + "(\\$?)([A-Z]+):(\\$?)([A-Z]+)", "g");
			return u.deString(t, function(t) {
				return (t = t.replace(i, function(t, e, n, i, r, o) {
					return n ? t : (n = pq.toNumber(i) + l, s = e ? d(e) : s, n = n < 0 ? 0 : s && s < n ? s : n, (e || "") + pq.toLetter(n) + r + o)
				})).replace(r, function(t, e, n, i, r, o) {
					var a;
					return s = e ? d(e) : s, n || (a = (a = pq.toNumber(i) + l) < 0 ? 0 : s && s < a ? s : a, i = pq.toLetter(a)), r || (a = (a = pq.toNumber(o) + l) < 0 ? 0 : s && s < a ? s : a, o = pq.toLetter(a)), (e || "") + n + i + ":" + r + o
				})
			})
		}
	}), u.reSheetC = u.reSheet.replace("?:", ""), u.prototype = {
		addRowIndx: function(t) {
			t.forEach(function(t) {
				var e, n, i = t.newRow,
					r = i.pq_fn;
				if (r)
					for (n in r)(e = r[n]).ri = e.riO = i.pq_ri
			})
		},
		cell: function(t) {
			var t = this.toCell(t),
				e = t.r,
				t = t.c;
			return this.valueArr(e, t)[0]
		},
		check: function(t) {
			return u.deString(t, function(t) {
				return (t = t.replace(/[^']+(\s+)(?![^']+')/g, function(t) {
					return t.replace(/\s/g, "")
				})).toUpperCase().replace(/([A-Z]+)([0-9]+)\:([A-Z]+)([0-9]+)/g, function(t, e, n, i, r) {
					return e = pq.toNumber(e), (i = pq.toNumber(i)) < e && (e = [i, i = e][0]), +r < +n && (n = [r, r = n][0]), pq.toLetter(e) + n + ":" + pq.toLetter(i) + r
				})
			})
		},
		computeAll: function() {
			var e, a = this,
				l = a.that;
			if (a.initObj(), a.eachFormula(function(t) {
					t.clean = 0, e = !0
				}), e) return a.eachFormula(function(t, e, n, i, r) {
				try {
					var o = a.execIfDirty(t)
				} catch (t) {
					o = pq.isStr(t) ? t : t.message
				}
				e[n] = o, r && l.isValid({
					rowIndx: i,
					rowData: e,
					dataIndx: n,
					allowInvalid: !0
				})
			}), !0
		},
		eachFormula: function(o) {
			function t(t) {
				for (var e, n, i = (t = t || []).length; i--;)(e = t[i]) && (n = e.pq_fn) && r(e, i, n)
			}
			var a = !0,
				e = this.that,
				l = e.columns,
				r = function(t, e, n) {
					var i, r;
					for (i in n) l[i] && "string" != typeof(r = n[i]) && o(r, t, i, e, a)
				};
			t(e.get_p_data()), a = !1, t(e.options.summaryData)
		},
		execIfDirty: function(t, e) {
			if (t.clean) {
				if (.5 == t.clean) return e
			} else t.clean = .5, t.val = this.exec(t.fn, t.ri, t.ci), t.clean = 1;
			return t.val
		},
		replace: function(t, e, n) {
			var i = e.lastIndexOf("!"),
				r = t === e,
				o = this.obj;
			return 0 < i || (o[e] = o[e] || this[n](e)), "range" == n ? "this['" + e + "']" : (i = t.charAt(0), (r || "$" == i ? "" : i) + "this['" + e + "']")
		},
		exec: function(t, e, n) {
			var i = this,
				r = i.obj,
				o = i.replaceOutSheet,
				a = u.reSheet,
				t = u.deString(t, function(t) {
					var e = "(?:\\(|\\,|^|\\+)((" + a + "\\$?[A-Z]+\\$?[0-9]+\\+?){2,})(?:\\)|\\,|$|\\+)";
					return t = t.replace(new RegExp(e, "g"), function(t, e) {
						var n = "SUM(" + o(e, "\\+", "?").split("?").join(",") + ")",
							i = t[0],
							t = t[t.length - 1];
						return (i = i == e[0] ? "" : i) + n + (t = t == e[e.length - 1] ? "" : t)
					}), t = o(t, "\\^", "**"), t = o(t, "\\%", "/100"), t = o(t, "{", "["), t = (t = o(t, "}", "]")).replace(/(?:[^><])(=+)/g, function(t, e) {
						return t + (1 === e.length ? "==" : "")
					}), t = o(t, "<>", "!=="), t = (t = (t = o(t, "&", "+")).replace(new RegExp("(" + a + "\\$?([A-Z]+)?\\$?([0-9]+)?\\:\\$?([A-Z]+)?\\$?([0-9]+)?)", "g"), function(t, e) {
						return i.replace(t, e, "range")
					})).replace(new RegExp("(?:[^:A-Z'$]|^)(" + a + "\\$?[A-Z]+\\$?[0-9]+)(?![:\\d]+)", "g"), function(t, e) {
						return 0 < t.indexOf(":") ? t : i.replace(t, e, "cell")
					})
				}, !0);
			r.getRange = function() {
				return {
					r1: e,
					c1: n
				}
			};
			try {
				var l = new Function("with(this){return " + t + "}").call(r);
				pq.isFn(l) ? l = "#NAME?" : pq.isStr(l) && u.deString(l, function(t) {
					0 <= t.indexOf("function") && (l = "#NAME?")
				}), l != l && (l = null)
			} catch (t) {
				l = pq.isStr(t) ? t : t.message
			}
			return l
		},
		replaceOutSheet: function(t, e, n) {
			return t.replace(new RegExp("'(?:[^']|'')+'|(" + e + ")", "g"), function(t, e) {
				return t == e ? n : t
			})
		},
		initObj: function() {
			this.obj = t.extend({
				iFormula: this
			}, pq.formulas)
		},
		onAutofill: function(t, e) {
			var n = e.sel,
				i = this.that,
				r = n.r,
				n = n.c,
				o = e.x,
				r = i.getRowData({
					rowIndx: r
				}),
				a = i.colModel,
				l = a.length - 1,
				s = i.get_p_data().length - 1,
				d = this.tabNames,
				i = a[n].dataIndx,
				c = this.getFnW(r, i);
			c && (e.series = function(t) {
				return "=" + (o ? u.shiftC(c.fn, t - 1, l, d) : u.shiftR(c.fn, t - 1, s, d))
			})
		},
		onBeforeValidateDone: function(t, a) {
			function e(t) {
				t.forEach(function(t) {
					var e, n = t.newRow,
						i = t.rowData;
					for (e in n) {
						var r, o = n[e];
						pq.isStr(o) && "=" === o[0] ? (a.allowInvalid = !0, o = l.check(o), (r = i ? l.getFnW(i, e) : null) ? o !== r.fn && (t.oldRow[e] = "=" + r.fn, l.save(i, e, o, t.rowIndx, s[e])) : l.save(i || n, e, o, t.rowIndx, s[e])) : i && (r = l.remove(i, e)) && (t.oldRow[e] = "=" + r.fn)
					}
				})
			}
			var l = this,
				s = this.that.colIndxs;
			e(a.addList), e(a.updateList)
		},
		onTabChange: function(t, e) {
			!this.tabNames[e.tab.name.toUpperCase()] || e.addList.length || e.deleteList.length || (this.computeAll(), this.that.refresh())
		},
		onTabRename: function(t, e) {
			function n(t) {
				return t = t.replace(/'/g, "''"), (t = /[\s~!@#'\.,$%^&(\)<>]+/.test(t) ? "'" + t + "'" : t) + "!"
			}
			var i = this.tabNames,
				r = e.oldVal.toUpperCase(),
				o = e.tab.name.toUpperCase();
			i[r] && (delete i[r], i[o] = 1, o = n(o), r = n(r), this.eachFormula(function(t) {
				t.fn = t.fn.split(r).join(o)
			}))
		},
		onChange: function(t, e) {
			this.addRowIndx(e.addList), e.addList.length || e.deleteList.length || this.computeAll()
		},
		onColumnAMR: function() {
			var i, r, t = this.that,
				o = u.shiftRC(t),
				a = t.colIndxs;
			this.eachFormula(function(t, e, n) {
				i = a[n], t.ci != i && (r = i - t.ciO, t.ci = i, t.fn = o(t.fnOrig, r, t.ri - t.riO))
			}), null != i && this.computeAll()
		},
		onEditorBegin: function(t, e) {
			var n = this.getFnW(e.rowData, e.dataIndx);
			n && e.$editor.val("=" + n.fn)
		},
		onEditorEnd: function() {
			pq.intel.hide()
		},
		onEditorKeyUp: function(t, e) {
			var n, e = e.$editor,
				i = e.val(),
				r = pq.intel;
			i && 0 === i.indexOf("=") && (n = e.is("textarea") ? 1 : e.is("div[contenteditable") ? 2 : 0) && (n = 2 == n ? window.getSelection().getRangeAt(0).startOffset : ed.selectionEnd, r.popup(i, n, e), this.select(i, n))
		},
		onDataReadyDone: function() {
			function t(t) {
				for (var e, n, i = (t = t || []).length; i--;)(e = t[i]) && (n = e.pq_fn) && r(e, i, n)
			}
			var a, l = this,
				e = l.that,
				s = u.shiftRC(e),
				d = e.colIndxs,
				r = function(t, e, n) {
					var i, r, o;
					for (r in n) i = n[r], a = !0, pq.isStr(i) ? l.save(t, r, l.check(i), e, d[r]) : i.ri != e && (o = e - i.riO, i.ri = e, i.fn = s(i.fnOrig, i.ci - i.ciO, o))
				};
			t(e.get_p_data()), t(e.options.summaryData), l.initObj(), a && l.computeAll()
		},
		getFnW: function(t, e) {
			if (t = t.pq_fn) return t[e]
		},
		remove: function(t, e) {
			var n, i = t.pq_fn;
			if (i && (n = i[e])) return delete i[e], pq.isEmpty(i) && delete t.pq_fn, n
		},
		range: function(t) {
			var t = t.split(":"),
				e = this.that,
				n = this.toCell(t[0]),
				i = n.r,
				n = n.c,
				t = this.toCell(t[1]),
				r = t.r,
				t = t.c;
			return this.valueArr(null == i ? 0 : i, null == n ? 0 : n, null == r ? e.get_p_data().length - 1 : r, null == t ? e.colModel.length - 1 : t)
		},
		save: function(t, e, n, i, r) {
			n = n.replace(/^=/, ""), n = {
				clean: 0,
				fn: n,
				fnOrig: n,
				riO: i,
				ciO: r,
				ri: i,
				ci: r
			};
			return (t.pq_fn = t.pq_fn || {})[e] = n
		},
		selectRange: function(t, e) {
			var n, i, t = u.selectExp(t, e);
			if (t) return /^([a-z0-9]+):([a-z0-9]+)$/i.test(t) ? (e = t.split(":"), n = this.toCell(e[0]), e = this.toCell(e[1]), i = {
				r1: n.r,
				c1: n.c,
				r2: e.r,
				c2: e.c
			}) : /^[a-z]+[0-9]+$/i.test(t) && (i = {
				r1: (n = this.toCell(t)).r,
				c1: n.c
			}), i
		},
		select: function(t, e) {
			t = this.selectRange(t, e), e = this.that;
			t ? e.Range(t).select() : e.Selection().removeAll()
		},
		toCell: function(t) {
			t = t.match(/\$?([A-Z]+)?\$?(\d+)?/);
			return {
				c: t[1] ? pq.toNumber(t[1]) : null,
				r: t[2] ? t[2] - 1 : null
			}
		},
		valueArr: function(t, e, n, i) {
			var r, o, a, l, s, d, c = this.that,
				u = c.colModel,
				h = u.length,
				f = [],
				p = [],
				g = [],
				m = c.get_p_data(),
				c = m.length;
			for (i = null == i ? e : i, e = e < 0 ? 0 : e, n = c <= (n = null == n ? t : n) ? c - 1 : n, i = h <= i ? h - 1 : i, r = t = t < 0 ? 0 : t; r <= n; r++) {
				for (a = m[r], o = e; o <= i; o++) l = u[o].dataIndx, (s = this.getFnW(a, l)) ? d = this.execIfDirty(s, a[l]) : null == (d = a[l]) && (d = ""), f.push(d), g.push(d);
				p.push(g), g = []
			}
			return f.get2Arr = function() {
				return p
			}, f.getRange = function() {
				return {
					r1: t,
					c1: e,
					r2: n,
					c2: i
				}
			}, f
		}
	}
}(jQuery), ! function(a) {
	pq.intel = {
		removeFn: function(t) {
			return t.length === (t = t.replace(/[a-z]*\([^()]*\)/gi, "")).length ? t : this.removeFn(t)
		},
		removeStrings: function(t) {
			return (t = t.replace(/"[^"]*"/g, "")).replace(/"[^"]*$/, "")
		},
		getMatch: function(t, e) {
			var n, i = pq.formulas,
				r = [];
			for (n in t = t.toUpperCase(), i)
				if (e) {
					if (n === t) return [n]
				} else 0 === n.indexOf(t) && r.push(n);
			return r
		},
		intel: function(t) {
			t = this.removeStrings(t);
			var e, n;
			return (t = (t = this.removeFn(t)).match(/^=(.*[,+\-&*\s(><=])?([a-z]+)((\()[^)]*)?$/i)) && (e = t[2], t[4] && (n = !0)), [e, n]
		},
		movepos: function(t) {
			var e;
			return (e = t.match(/([^a-z].*)/i)) ? t.indexOf(e[1]) + 1 : t.length
		},
		intel3: function(t, e) {
			e < t.length && /=(.*[,+\-&*\s(><=])?[a-z]+$/i.test(t.slice(0, e)) && (e += this.movepos(t.slice(e)));
			t = t.substr(0, e);
			return this.intel(t)
		},
		item: function(t) {
			var e = this.that.options.strFormulas;
			return "<div>" + ((e = e ? e[t] : null) ? e[0] : t) + "</div>" + (e ? "<div style='font-size:0.9em;color:#888;margin-bottom:5px;'>" + e[1] + "</div>" : "")
		},
		popup: function(t, e, n) {
			var i = n.closest(".pq-grid"),
				r = a(".pq-intel"),
				o = i,
				t = this.intel3(t, e);
			this.that = i.pqGrid("instance"), r.remove(), (e = t[0]) && (i = this.getMatch(e, t[1]).map(this.item, this).join("")) && a("<div class='pq-intel' style='width:350px;max-height:300px;overflow:auto;background:#fff;border:1px solid gray;box-shadow: 4px 4px 2px #aaaaaa;padding:5px;'></div>").appendTo(o).html(i).position({
				my: "center top",
				at: "center bottom",
				collision: "flipfit",
				of: n,
				within: o
			})
		},
		hide: function() {
			a(".pq-intel").remove()
		}
	}
}(jQuery), ! function($) {
	var f = pq.formulas = {
		evalify: function(t, e) {
			var n, i, e = e.match(/([><=]{1,2})?(.*)/),
				r = e[1] || "=",
				o = e[2],
				a = this;
			return /(\*|\?)/.test(o) ? n = o.replace(/\*/g, ".*").replace(/\?/g, "\\S").replace(/\(/g, "\\(").replace(/\)/g, "\\)") : (r = "=" === r ? "==" : "<>" === r ? "!=" : r, i = this.ISNUMBER(o)), t.map(function(t) {
				return t = n ? ("<>" === r ? "!" : "") + "/^" + n + '$/i.test("' + (t = null == t ? "" : t) + '")' : i ? a.ISNUMBER(t) ? t + r + o : "false" : '"' + ((t = null == t ? "" : t) + "").toUpperCase() + '"' + r + '"' + (o + "").toUpperCase() + '"'
			})
		},
		get2Arr: function(t) {
			return t.get2Arr ? t.get2Arr() : t
		},
		ISNUMBER: function(t) {
			return parseFloat(t) == t
		},
		_reduce: function(t, i) {
			var e = [],
				r = i.map(function() {
					return []
				});
			return t.forEach(function(t, n) {
				null != t && (t = +t, isNaN(t) || (e.push(t), r.forEach(function(t, e) {
					t.push(i[e][n])
				})))
			}), [e, r]
		},
		reduce: function(n) {
			var t = (n = this.toArray(n)).shift(),
				i = n.filter(function(t, e) {
					return e % 2 == 0
				}),
				e = this._reduce(t, i),
				t = e[0],
				i = e[1];
			return [t].concat(n.map(function(t, e) {
				return e % 2 == 0 ? i[e / 2] : n[e]
			}))
		},
		strDate1: "(\\d{1,2})/(\\d{1,2})/(\\d{2,4})",
		strDate2: "(\\d{4})-(\\d{1,2})-(\\d{1,2})",
		strDate3: "(\\d{1,2})-(\\d{1,2})-(\\d{4})",
		strTime: "(\\d{1,2})(:(\\d{1,2}))?(:(\\d{1,2}))?(\\s(AM|PM))?",
		isDate: function(t) {
			return this.reDate.test(t) && Date.parse(t) || t && t.constructor == Date
		},
		toArray: function(t) {
			for (var e = [], n = 0, i = t.length; n < i; n++) e.push(t[n]);
			return e
		},
		valueToDate: function(t) {
			var e = new Date(Date.UTC(1900, 0, 1));
			return e.setUTCDate(e.getUTCDate() + t - 2), e
		},
		varToDate: function(t) {
			var e, n, i, r, o;
			if (this.ISNUMBER(t)) e = this.valueToDate(t);
			else if (t.getTime) e = t;
			else if (pq.isStr(t)) {
				if ((n = (t = $.trim(t)).match(this.reDateTime)) ? n[12] ? (o = +n[13], r = +n[15], i = +n[14]) : (i = +n[2], r = +n[3], o = +n[4]) : (n = t.match(this.reDate2)) ? (o = +n[1], r = +n[3], i = +n[2]) : (n = t.match(this.reDate1)) ? (i = +n[1], r = +n[2], o = +n[3]) : (n = t.match(this.reDate3)) && (r = +n[1], i = +n[2], o = +n[3]), !n) return t;
				t = Date.UTC(o, i - 1, r), e = new Date(t)
			}
			return e
		},
		_IFS: function(arg, fn) {
			for (var len = arg.length, i = 0, arr = [], a = 0; i < len; i += 2) arr.push(this.evalify(arg[i], arg[i + 1]));
			for (var condsIndx = arr[0].length, lenArr = len / 2, j; condsIndx--;) {
				for (j = 0; j < lenArr && eval(arr[j][condsIndx]); j++);
				a += j === lenArr ? fn(condsIndx) : 0
			}
			return a
		},
		ABS: function(t) {
			return Math.abs(t.map ? t[0] : t)
		},
		ACOS: function(t) {
			return Math.acos(t)
		},
		ADDRESS: function(t, e, n) {
			return (2 == n || 4 == n ? "" : "$") + pq.toLetter(e - 1) + (3 == n || 4 == n ? "" : "$") + t
		},
		AND: function() {
			var arr = this.toArray(arguments);
			return eval(arr.join(" && "))
		},
		ASIN: function(t) {
			return Math.asin(t)
		},
		ATAN: function(t) {
			return Math.atan(t)
		},
		_AVERAGE: function(t) {
			var e = 0,
				n = 0;
			if (t.forEach(function(t) {
					parseFloat(t) == t && (n += +t, e++)
				}), e) return n / e;
			throw "#DIV/0!"
		},
		AVERAGE: function() {
			return this._AVERAGE(pq.flatten(arguments))
		},
		AVERAGEIF: function(t, e, n) {
			return this.AVERAGEIFS(n || t, t, e)
		},
		AVERAGEIFS: function() {
			var t = this.reduce(arguments),
				e = 0,
				n = t.shift(),
				t = this._IFS(t, function(t) {
					return e++, n[t]
				});
			if (e) return t / e;
			throw "#DIV/0!"
		},
		TRUE: !0,
		FALSE: !1,
		CEILING: function(t) {
			return Math.ceil(t)
		},
		CHAR: function(t) {
			return String.fromCharCode(t)
		},
		CHOOSE: function() {
			var t = pq.flatten(arguments),
				e = t[0];
			if (0 < e && e < t.length) return t[e];
			throw "#VALUE!"
		},
		CODE: function(t) {
			return (t + "").charCodeAt(0)
		},
		COLUMN: function(t) {
			return (t || this).getRange().c1 + 1
		},
		COLUMNS: function(t) {
			t = t.getRange();
			return t.c2 - t.c1 + 1
		},
		CONCAT: function() {
			return this.CONCATENATE.apply(this, arguments)
		},
		CONCATENATE: function() {
			var t = pq.flatten(arguments),
				e = "";
			return t.forEach(function(t) {
				e += t
			}), e
		},
		COS: function(t) {
			return Math.cos(t)
		},
		_COUNT: function(t) {
			var t = pq.flatten(t),
				e = this,
				n = 0,
				i = 0,
				r = 0;
			return t.forEach(function(t) {
				null == t || "" === t ? n++ : (i++, e.ISNUMBER(t) && r++)
			}), [n, i, r]
		},
		COUNT: function() {
			return this._COUNT(arguments)[2]
		},
		COUNTA: function() {
			return this._COUNT(arguments)[1]
		},
		COUNTBLANK: function() {
			return this._COUNT(arguments)[0]
		},
		COUNTIF: function(t, e) {
			return this.COUNTIFS(t, e)
		},
		COUNTIFS: function() {
			return this._IFS(arguments, function() {
				return 1
			})
		},
		DATE: function(t, e, n) {
			if (t < 0 || 9999 < t) throw "#NUM!";
			return t <= 1899 && (t += 1900), this.VALUE(new Date(Date.UTC(t, e - 1, n)))
		},
		DATEVALUE: function(t) {
			return this.DATEDIF("1/1/1900", t, "D") + 2
		},
		DATEDIF: function(t, e, n) {
			var i, e = this.varToDate(e),
				t = this.varToDate(t),
				r = (e.getTime() - t.getTime()) / 864e5;
			if ("Y" === n) return parseInt(r / 365);
			if ("M" === n) return i = e.getUTCMonth() - t.getUTCMonth() + 12 * (e.getUTCFullYear() - t.getUTCFullYear()), t.getUTCDate() > e.getUTCDate() && i--, i;
			if ("D" === n) return r;
			throw "unit N/A"
		},
		DAY: function(t) {
			return this.varToDate(t).getUTCDate()
		},
		DAYS: function(t, e) {
			return this.DATEDIF(e, t, "D")
		},
		DEGREES: function(t) {
			return 180 / Math.PI * t
		},
		EOMONTH: function(t, e) {
			e = e || 0;
			t = this.varToDate(t);
			return t.setUTCMonth(t.getUTCMonth() + e + 1), t.setUTCDate(0), this.VALUE(t)
		},
		EXP: function(t) {
			return Math.exp(t)
		},
		FIND: function(t, e, n) {
			return e.indexOf(t, n ? n - 1 : 0) + 1
		},
		FLOOR: function(t, e) {
			return t * e < 0 ? "#NUM!" : parseInt(t / e) * e
		},
		HLOOKUP: function(t, e, n, i) {
			null == i && (i = !0), e = this.get2Arr(e);
			t = this.MATCH(t, e[0], i ? 1 : 0);
			return this.INDEX(e, n, t)
		},
		HOUR: function(t) {
			return Date.parse(t) ? new Date(t).getHours() : 24 * t
		},
		HYPERLINK: function(t, e) {
			return e || t
		},
		IF: function(t, e, n) {
			return t ? e : n
		},
		INDEX: function(t, e, n) {
			return t = this.get2Arr(t), e = e || 1, n = n || 1, pq.isFn(t[0].push) ? t[e - 1][n - 1] : t[1 < e ? e - 1 : n - 1]
		},
		INDIRECT: function(t) {
			return this.iFormula[0 < t.indexOf(":") ? "range" : "cell"](t)
		},
		ISBLANK: function(t) {
			return "" === t
		},
		LARGE: function(t, e) {
			return t.sort(), t[t.length - (e || 1)]
		},
		LEFT: function(t, e) {
			return t.substr(0, e || 1)
		},
		LEN: function(t) {
			return 1 < (t = (t.map ? t : [t]).map(function(t) {
				return t.length
			})).length ? t : t[0]
		},
		LOOKUP: function(t, e, n) {
			n = n || e;
			t = this.MATCH(t, e, 1);
			return this.INDEX(n, 1, t)
		},
		LOWER: function(t) {
			return (t + "").toLocaleLowerCase()
		},
		_MAXMIN: function(t, e) {
			var n, i = this;
			return t.forEach(function(t) {
				null != t && (t = i.VALUE(t), i.ISNUMBER(t) && (n * e < t * e || null == n) && (n = t))
			}), null != n ? n : 0
		},
		MATCH: function(val, arr, type) {
			var ISNUMBER = this.ISNUMBER(val),
				_isNumber, indx, _val, i = 0,
				len = arr.length;
			if (null == type && (type = 1), val = ISNUMBER ? val : val.toUpperCase(), 0 === type) {
				for (arr = this.evalify(arr, val + ""), i = 0; i < len; i++)
					if (_val = arr[i], eval(_val)) {
						indx = i + 1;
						break
					}
			} else {
				for (i = 0; i < len; i++)
					if (_val = arr[i], _isNumber = this.ISNUMBER(_val), _val = arr[i] = _isNumber ? _val : _val ? _val.toUpperCase() : "", val == _val) {
						indx = i + 1;
						break
					} if (!indx) {
					for (i = 0; i < len; i++)
						if (_val = arr[i], _isNumber = this.ISNUMBER(_val), type * (_val < val ? -1 : 1) == 1 && ISNUMBER == _isNumber) {
							indx = i;
							break
						} indx = null == indx ? i : indx
				}
			}
			if (indx) return indx;
			throw "#N/A"
		},
		MAX: function() {
			var t = pq.flatten(arguments);
			return this._MAXMIN(t, 1)
		},
		MEDIAN: function() {
			var t = pq.flatten(arguments).filter(function(t) {
					return +t == t
				}).sort(function(t, e) {
					return e - t
				}),
				e = t.length,
				n = e / 2;
			return n === parseInt(n) ? (t[n - 1] + t[n]) / 2 : t[(e - 1) / 2]
		},
		MID: function(t, e, n) {
			if (e < 1 || n < 0) throw "#VALUE!";
			return t.substr(e - 1, n)
		},
		MIN: function() {
			var t = pq.flatten(arguments);
			return this._MAXMIN(t, -1)
		},
		MODE: function() {
			var e, n, t = pq.flatten(arguments),
				i = {},
				r = 0;
			if (t.forEach(function(t) {
					e = i[t] = i[t] ? i[t] + 1 : 1, r < e && (r = e, n = t)
				}), r < 2) throw "#N/A";
			return n
		},
		MONTH: function(t) {
			return this.varToDate(t).getUTCMonth() + 1
		},
		OR: function() {
			var arr = this.toArray(arguments);
			return eval(arr.join(" || "))
		},
		PI: function() {
			return Math.PI
		},
		POWER: function(t, e) {
			return Math.pow(t, e)
		},
		PRODUCT: function() {
			var t = pq.flatten(arguments),
				e = 1;
			return t.forEach(function(t) {
				e *= t
			}), e
		},
		PROPER: function(t) {
			return t = t.replace(/(\S+)/g, function(t) {
				return t.charAt(0).toUpperCase() + t.substr(1).toLowerCase()
			})
		},
		RADIANS: function(t) {
			return Math.PI / 180 * t
		},
		RAND: function() {
			return Math.random()
		},
		RANK: function(t, e, n) {
			for (var i = JSON.stringify(e.getRange()) + "_range", r = 0, o = (e = this[i] || (this[i] = e).sort(function(t, e) {
					return t - e
				})).length; r < o; r++)
				if (t === e[r]) return n ? r + 1 : o - r
		},
		RATE: function() {},
		REPLACE: function(t, e, n, i) {
			return (t += "").substr(0, e - 1) + i + t.substr(e + n - 1)
		},
		REPT: function(t, e) {
			for (var n = ""; e--;) n += t;
			return n
		},
		RIGHT: function(t, e) {
			return t.substr(-1 * (e = e || 1), e)
		},
		_ROUND: function(t, e, n) {
			var e = Math.pow(10, e),
				t = t * e,
				i = parseInt(t);
			return n(i, t - i) / e
		},
		ROUND: function(t, e) {
			return this._ROUND(t, e, function(t, e) {
				var n = Math.abs(e);
				return t + (.5 <= n ? n / e : 0)
			})
		},
		ROUNDDOWN: function(t, e) {
			return this._ROUND(t, e, function(t) {
				return t
			})
		},
		ROUNDUP: function(t, e) {
			return this._ROUND(t, e, function(t, e) {
				return t + (e ? Math.abs(e) / e : 0)
			})
		},
		ROW: function(t) {
			return (t || this).getRange().r1 + 1
		},
		ROWS: function(t) {
			t = t.getRange();
			return t.r2 - t.r1 + 1
		},
		SEARCH: function(t, e, n) {
			return t = t.toUpperCase(), (e = e.toUpperCase()).indexOf(t, n ? n - 1 : 0) + 1
		},
		SIN: function(t) {
			return Math.sin(t)
		},
		SMALL: function(t, e) {
			return t.sort(), t[(e || 1) - 1]
		},
		SQRT: function(t) {
			return Math.sqrt(t)
		},
		_STDEV: function(t) {
			var e = (t = pq.flatten(t)).length,
				n = this._AVERAGE(t),
				i = 0;
			return t.forEach(function(t) {
				i += (t - n) * (t - n)
			}), [i, e]
		},
		STDEV: function() {
			var t = this._STDEV(arguments);
			if (1 === t[1]) throw "#DIV/0!";
			return Math.sqrt(t[0] / (t[1] - 1))
		},
		STDEVP: function() {
			var t = this._STDEV(arguments);
			return Math.sqrt(t[0] / t[1])
		},
		SUBSTITUTE: function(t, e, n, i) {
			var r = 0;
			return t.replace(new RegExp(e, "g"), function() {
				return r++, !i || r === i ? n : e
			})
		},
		SUM: function() {
			var t = pq.flatten(arguments),
				e = 0,
				n = this;
			return t.forEach(function(t) {
				t = n.VALUE(t), n.ISNUMBER(t) && (e += parseFloat(t))
			}), e
		},
		SUMIF: function(t, e, n) {
			return this.SUMIFS(n || t, t, e)
		},
		SUMIFS: function() {
			var t = this.reduce(arguments),
				e = t.shift();
			return this._IFS(t, function(t) {
				return e[t]
			})
		},
		SUMPRODUCT: function() {
			var i = (i = this.toArray(arguments))[0].map(function(t, e) {
				var n = 1;
				return i.forEach(function(t) {
					t = t[e];
					n *= parseFloat(t) == t ? t : 0
				}), n
			});
			return pq.aggregate.sum(i)
		},
		TAN: function(t) {
			return Math.tan(t)
		},
		TEXT: function(t, e) {
			var n;
			return this.ISNUMBER(t) && 0 <= e.indexOf("#") ? pq.formatNumber(t, e) : (n = this.varToDate(t)) && n.constructor == Date ? $.datepicker.formatDate(pq.excelToJui(e), n) : t
		},
		TIME: function(t, e, n) {
			return (t + e / 60 + n / 3600) / 24
		},
		TIMEVALUE: function(t) {
			var e, n, i, r, t = t.match(this.reTime);
			if (!t || null == t[1] || null == t[3] && null == t[7] || (e = +t[1], r = +(t[3] || 0), n = +(t[5] || 0), i = (t[7] || "").toUpperCase(), r = e + r / 60 + n / 3600), 0 <= r && (i && r < 13 || !i && r < 24)) return "PM" == i && e < 12 ? r += 12 : "AM" == i && 12 == e && (r -= 12), r / 24;
			throw "#VALUE!"
		},
		TODAY: function() {
			var t = new Date;
			return this.VALUE(new Date(Date.UTC(t.getFullYear(), t.getMonth(), t.getDate())))
		},
		TRIM: function(t) {
			return t.replace(/^\s+|\s+$/gm, "")
		},
		TRUNC: function(t, e) {
			return ~~(t * (e = Math.pow(10, e || 0))) / e
		},
		UNIQUE: function(t) {
			return pq.arrayUnique(t)
		},
		UPPER: function(t) {
			return (t + "").toLocaleUpperCase()
		},
		VALUE: function(t) {
			var e, n, i;
			return t ? parseFloat(t) == t ? parseFloat(t) : this.isDate(t) ? this.DATEVALUE(t) : (e = t.match(this.reDateTime)) ? (n = e[1] || e[12], i = t.substr(n.length + 1), this.DATEVALUE(n) + this.TIMEVALUE(i)) : (e = t.match(this.reTime)) ? this.TIMEVALUE(t) : t.replace(/[^0-9\-.]/g, "").replace(/(\.[1-9]*)0+$/, "$1").replace(/\.$/, "") : 0
		},
		VAR: function() {
			var t = this._STDEV(arguments);
			return t[0] / (t[1] - 1)
		},
		VARP: function() {
			var t = this._STDEV(arguments);
			return t[0] / t[1]
		},
		VLOOKUP: function(t, e, n, i) {
			null == i && (i = !0);
			var r = (e = this.get2Arr(e)).map(function(t) {
					return t[0]
				}),
				t = this.MATCH(t, r, i ? 1 : 0);
			return this.INDEX(e, t, n)
		},
		YEAR: function(t) {
			return this.varToDate(t).getUTCFullYear()
		}
	};
	f.reDate1 = new RegExp("^" + f.strDate1 + "$"), f.reDate2 = new RegExp("^" + f.strDate2 + "$"), f.reDate3 = new RegExp("^" + f.strDate3 + "$"), f.reDate = new RegExp("^" + f.strDate1 + "$|^" + f.strDate2 + "$|^" + f.strDate3 + "$"), f.reTime = new RegExp("^" + f.strTime + "$", "i"), f.reDateTime = new RegExp("^(" + f.strDate1 + ")\\s" + f.strTime + "$|^(" + f.strDate2 + ")\\s" + f.strTime + "$|^(" + f.strDate3 + ")\\s" + f.strTime + "$")
}(jQuery), ! function(r) {
	pq.Select = function(t, e, n) {
		var i = document.body,
			i = r("<div/>").appendTo(i);
		return pq.grid(i, r.extend({
			width: "flex",
			height: "flex",
			autoRow: !1,
			rowBorders: !1,
			columnBorders: !1,
			editable: !1,
			numberCell: {
				show: !1
			},
			hoverMode: "row",
			fillHandle: "",
			stripeRows: !1,
			showTop: !1,
			showHeader: !1
		}, t)), pq.makePopup(i[0], e[0], n), i.position({
			my: "left top",
			at: "left bottom",
			of: e,
			collision: "fit"
		}), i
	}
}(jQuery), ! function(y) {
	function i(t) {
		this.options = t.options
	}
	i.prototype = {
		empty: function() {
			for (var t in this) 0 == t.indexOf("_") && delete this[t];
			delete this.options.dataModel.dataPrimary
		},
		getCM: function() {
			return this._cm
		},
		setCM: function(t) {
			this._cm = t
		},
		getCols: function() {
			return this._columns
		},
		setCols: function(t) {
			this._columns = t
		},
		getDMData: function() {
			return this.options.dataModel.dataPrimary
		},
		setDMData: function(t) {
			this.options.dataModel.dataPrimary = t
		},
		getOCM: function() {
			return this._ocm
		},
		setOCM: function(t) {
			this._ocm = t
		}
	}, y(document).on("pqGrid:bootup", function(t, e) {
		var e = e.instance,
			n = e.Group();
		n.primary = new i(e), e.on("beforeFilterDone", n.onBeforeFilterDone.bind(n)).one("CMInit", n.oneCMInit.bind(n))
	});
	var t, h = {},
		e = {
			clearPivot: function(t) {
				if (this.isPivot()) {
					var e = this.that,
						n = e.options.dataModel,
						i = this.primary,
						r = i.getOCM(),
						i = i.getDMData();
					if (r && e.refreshCM(r), t) {
						if (!i) throw "!primary.getDMData";
						n.data = i
					} else i && (n.data = i);
					return this.primary.empty(), this.setPivot(!1), !0
				}
			},
			getColsPrimary: function() {
				return this.primary.getCols() || this.that.columns
			},
			getCMPrimary: function() {
				return this.primary.getCM() || this.that.colModel
			},
			getOCMPrimary: function() {
				return this.primary.getOCM() || this.that.options.colModel
			},
			getSumCols: function() {
				var e = ")" + (this.that.options.rtl ? "&lrm;" : "");
				return (h.getSumCols.call(this) || []).map(function(t) {
					return [t.dataIndx, t.dataType, t.summary, t.summary.type + "(" + t.title + e, t.width, t.format, t.showifOpen]
				})
			},
			getVal: function() {
				return this._pivot ? function(t, e) {
					return t[e]
				} : h.getVal.apply(this, arguments)
			},
			groupData: function() {
				var t, e, n, i, r, o, a = this.that,
					l = a.options.groupModel,
					s = l.dataIndx,
					d = l.groupCols,
					c = this.primary,
					u = d.length;
				(c = c.getDMData()) && c[0] != a.pdata[0] || (l.pivot && (t = s.slice(), l.dataIndx = s = s.concat(d), e = l.titleInFirstCol, n = l.titleIndx, i = l.merge, l.titleInFirstCol = !1, l.titleIndx = null, l.merge = !1), h.groupData.call(this), l.pivot && (a.pdata = a.pdata.reduce(function(t, e) {
					return e.pq_gtitle && t.push(e), t
				}, []), n ? (l.titleInFirstCol = e, l.titleIndx = n) : 1 < t.length && (l.merge = i), this.pivotData(s, t), l.dataIndx = t.slice(0, t.length - 1), l.summaryInTitleRow = "all", u ? (r = n, o = t[t.length - 1], h.groupData.call(this, !0), n && r != o && a.pdata.forEach(function(t) {
					t.pq_gtitle || (t[r] = t[o])
				})) : n && a.pdata.forEach(function(t) {
					t[n] = t[[s[t.pq_level]]]
				}), l.dataIndx = t, this.setPivot(!0)), a._trigger("groupData"))
			},
			isPivot: function() {
				return this._pivot
			},
			getSorter: function(t) {
				return t.pivotSortFn || ("number" == pq.getDataType(t) ? function(t, e) {
					return +t.sortby > +e.sortby ? 1 : -1
				} : function(t, e) {
					return t.sortby > e.sortby ? 1 : -1
				})
			},
			nestedCM: function(p, t) {
				var e = this,
					n = t.groupCols,
					g = t.pivotColsTotal,
					m = "hideifOpen" != g && null,
					v = [],
					w = [],
					x = e.that.columns,
					x = n.map(function(t) {
						t = x[t];
						return v.push(e.getSorter(t)), w.push(pq.getDataType(t)), t
					});
				return function t(e, n, i) {
					n = n || 0, i = i || [];
					var r, o, a, l, s, d, c, u, h = 0,
						f = [];
					if (y.isEmptyObject(e))
						for (; h < p.length; h++) r = p[h], (o = i.slice()).push(r[0]), a = {
							dataIndx: o.join("_"),
							dataType: r[1],
							summary: r[2],
							title: r[3],
							width: r[4],
							format: r[5],
							showifOpen: r[6]
						}, f.push(a);
					else {
						for (s in r = x[n], l = w[n], e) c = "aggr" === s, (o = i.slice()).push(s), d = t(e[s], n + 1, o), c ? (u = d).forEach(function(t) {
							t.showifOpen = m, t.type = "aggr"
						}) : (a = {
							showifOpen: !0,
							sortby: s,
							title: pq.format(r, s, l),
							colModel: d
						}, 1 < d.length && !d.find(function(t) {
							return !t.type
						}).dataIndx && (a.collapsible = {
							on: !0,
							last: null
						}), f.push(a));
						f.sort(v[n]), u && f["before" == g ? "unshift" : "push"].apply(f, u)
					}
					return f
				}
			},
			onBeforeFilterDone: function(t, e) {
				if (this.isPivot()) {
					for (var n = e.rules, i = this.primary.getCols(), r = 0; r < n.length; r++)
						if (!i[n[r].dataIndx]) return !1;
					this.clearPivot(!0), e.header = !0
				}
			},
			oneCMInit: function() {
				this.updateAgg(this.that.options.groupModel.agg)
			},
			option: function(t, e, n, i) {
				this.clearPivot(), h.option.call(this, t, e, n, i)
			},
			pivotData: function(t, e) {
				var n = this.that,
					i = this.getSumCols(),
					r = this.getSumDIs(),
					o = n.options,
					a = o.groupModel,
					l = this.primary,
					s = n.pdata,
					d = n.columns,
					c = a.titleIndx,
					u = c ? [d[c]].concat(e.reduce(function(t, e) {
						return e != c && t.push(y.extend({
							hidden: !0
						}, d[e])), t
					}, [])) : e.map(function(t) {
						return d[t]
					}),
					s = this.transformData(s, r, t, e),
					r = this.nestedCM(i, a)(s),
					t = {};
				t.CM = u = u.concat(r), n._trigger("pivotCM", null, t), l.setOCM(o.colModel), l.setCM(n.colModel), l.setCols(n.columns), n.refreshCM(t.CM, {
					pivot: !0
				})
			},
			setPivot: function(t) {
				this._pivot = t
			},
			transformData: function(t, s, d, c) {
				var u, h, f, p, g = this,
					m = [],
					e = this.that,
					n = this.primary,
					v = {},
					w = [],
					i = e.options,
					r = i.dataModel,
					i = i.groupModel,
					x = i.pivotColsTotal,
					y = c.length,
					C = {},
					b = d.length;
				return y == b ? (t.forEach(function(t) {
					t.pq_level == y - 1 && (delete t.children, delete t.pq_gtitle)
				}), g.updateItems(t), m = t) : t.forEach(function(e) {
					var t, n, i = e.pq_level,
						r = i - y,
						o = C,
						a = d[i],
						l = e[a];
					if (0 <= r)
						for (w[r] = l, t = 0; t < 1 + r; t++) o = o[n = w[t]] = o[n] || {};
					i === b - 1 ? s.forEach(function(t) {
						(p = w.slice()).push(t), f[p.join("_")] = e[t]
					}) : ((!f || i < h && i < y) && (f = {
						pq_gid: g.idCount++
					}, u = !0), i < y && (v[a] = f[a] = l), x && i <= b - 2 && y - 1 <= i && s.forEach(function(t) {
						(p = w.slice(0, 1 + r)).push("aggr"), p.push(t), f[p.join("_")] = e[t]
					})), h = i, u && (m.push(f), c.forEach(function(t) {
						void 0 === f[t] && (f[t] = v[t])
					}), u = !1)
				}), n.setDMData(r.data), r.data = e.pdata = m, x && this.addAggrInCM(C, i.pivotTotalForSingle), C
			},
			addAggrInCM: function(t, e) {
				var n, i = 0;
				for (n in t) i++, this.addAggrInCM(t[n], e);
				(e ? 0 : 1) < i && (t.aggr = {})
			},
			updateAgg: function(t, e) {
				var n, i = this.that.columns;
				if (e)
					for (n in e) i[n].summary = null;
				if (t)
					for (n in t) i[n].summary = {
						type: t[n]
					}
			}
		},
		n = y.paramquery.cGroup.prototype;
	for (t in e) h[t] = n[t], n[t] = e[t]
}(jQuery), ! function(l) {
	var i, n = l.paramquery;
	n.pqGrid.defaults.toolPanel = {}, n.pqGrid.prototype.ToolPanel = function() {
		return this.iToolPanel
	}, l(document).on("pqGrid:bootup", function(t, e) {
		e = e.instance;
		e.iToolPanel = new n.cToolPanel(e)
	}), n.cToolPanel = function(t) {
		this.that = t, this.panes = [], this.clsSort = "pq-sortable", t.one("render", this.init.bind(this))
	}, n.cToolPanel.prototype = {
		getArray: function(t) {
			return t.find(".pq-pivot-col").get().map(function(t) {
				return t.dataset.di
			})
		},
		getInit: function() {
			return this._inited
		},
		getObj: function(t) {
			var n = {};
			return t.find(".pq-pivot-col").each(function(t, e) {
				n[e.dataset.di] = e.getAttribute("type") || "sum"
			}), n
		},
		getSortCancel: function() {
			return this._sortCancel
		},
		_hide: function(t) {
			this.$ele[t ? "hide" : "show"](), this.init(), this.that.refresh({
				soft: !0
			})
		},
		hide: function() {
			this._hide(!0)
		},
		disablePivotChkBox: function(t) {
			this.$pivotChk.prop("disabled", t)
		},
		init: function() {
			var t, e, n, i, r, o, a, l, s, d, c, u = this,
				h = u.$ele = u.that.$toolPanel;
			u.isVisible() && !u.getInit() && (n = (e = (t = u.that).options).toolPanel, d = e.groupModel, i = " pq-pivot-label pq-bg-3 ", r = " pq-pivot-pane pq-border-1 ", o = u.isHideColPane(), a = n.hidePivotChkBox, l = n.disablePivotChkBox, s = d.pivot ? "checked" : "", d = d.on ? "checked" : "", c = u.clsSort, h.html(["<div class='pq-pivot-cols-all", r, "'>", "<div class='", c, "' style='", a ? "padding-top:0;" : "", "'></div>", a ? "" : ["<div class='", i, "'>", "<label><input type='checkbox' ", l ? "disabled" : "", " class='pq-pivot-checkbox' ", s, "/>", e.strTP_pivot, "</label>", "</div>"].join(""), "</div>", "<div class='pq-pivot-rows", r, "' style='display:", n.hideRowPane ? "none" : "", ";'>", "<div deny='denyGroup' class='", c, "'></div>", "<div class='", i, "'>", n.hideGroupChkBox ? "<span class='pq-icon-pivot-rows'></span>" + e.strTP_rowPane : "<label><input type='checkbox' class='pq-group-checkbox' " + d + "/>" + e.strTP_rowPane + "</label>", "</div>", "</div>", "<div class='pq-pivot-cols", r, "' style='display:", o ? "none" : "", ";'>", "<div deny='denyPivot' class='", c, "'></div>", "<div class='", i, "'><span class='pq-icon-pivot-cols'></span>", e.strTP_colPane, "</div>", "</div>", "<div class='pq-pivot-vals", r, "' style='display:", n.hideAggPane ? "none" : "", ";'>", "<div deny='denyAgg' class='", c, "'></div>", "<div class='", i, "'><span class='pq-icon-pivot-vals'></span>", e.strTP_aggPane, "</div>", "</div>"].join("")), u.$pivotChk = h.find(".pq-pivot-checkbox").on("click", u.onPivotChange(u, t)), u.$groupChk = h.find(".pq-group-checkbox").on("click", u.onGroupChange(u, t)), u.$colsAll = h.find(".pq-pivot-cols-all>." + c), u.$colsPane = h.find(".pq-pivot-cols"), u.$cols = h.find(".pq-pivot-cols>." + c), u.$rows = h.find(".pq-pivot-rows>." + c), u.$aggs = h.find(".pq-pivot-vals>." + c).on("click contextmenu", u.onClick.bind(u)), t.on("refreshFull", u.setHt.bind(u)).on("groupOption", u.onGroupOption.bind(u)), setTimeout(function() {
				t.element && (t.on("CMInit", u.onCMInit.bind(u)), u.render())
			}), u.setInit())
		},
		isHideColPane: function() {
			var t = this.that.options;
			return t.toolPanel.hideColPane || !t.groupModel.pivot
		},
		isDeny: function(t, e, n) {
			e = e.attr("deny");
			return this.that.iGroup.getColsPrimary()[n[0].dataset.di][e]
		},
		isVisible: function() {
			return this.$ele.is(":visible")
		},
		onCMInit: function(t, e) {
			e.pivot || e.flex || e.group || this.that.Group().isPivot() || this.refresh()
		},
		onClick: function(t) {
			var e, n, i = l(t.target),
				r = this,
				t = r.that;
			if (!r.$popup && i.hasClass("pq-pivot-col")) return n = i[0].dataset.di, e = t.iGroup.getColsPrimary()[n], n = {
				dataModel: {
					data: t.iGroup.getAggOptions(e.dataType).sort().map(function(t) {
						return [t]
					})
				},
				colModel: [{
					title: e.title,
					width: 100
				}, {
					width: 28,
					title: "",
					minWidth: 28,
					render: function(t) {
						return t.rowData[0] == (e.summary || {}).type ? "<span class='ui-icon ui-icon-check'></span>" : ""
					}
				}],
				showHeader: !0,
				destroy: function() {
					r.$popup = null
				},
				cellClick: function(t, e) {
					e = e.rowData[0];
					i.attr("type", e), setTimeout(function() {
						r.$popup.remove(), r.refreshGrid(), r.refresh()
					})
				}
			}, r.$popup = pq.Select(n, i), !1
		},
		onGroupOption: function(t, e) {
			var n;
			"tp" != e.source && (e = e.oldGM, (n = this.that.options.groupModel).groupCols == e.groupCols && n.agg == e.agg && n.dataIndx == e.dataIndx && n.pivot == e.pivot || this.refresh())
		},
		onPivotChange: function(t, e) {
			return function() {
				e.Group().option({
					pivot: !!this.checked
				}, null, "tp"), t.showHideColPane()
			}
		},
		onGroupChange: function(t, e) {
			return function() {
				e.Group().option({
					on: !!this.checked
				}, null, "tp")
			}
		},
		ph: function(t) {
			return "<span style='color:#999;margin:1px;display:inline-block;'>" + t + "</span>"
		},
		refreshGrid: function() {
			var t = this,
				e = t.that,
				n = t.getArray(t.$cols),
				i = t.getObj(t.$aggs),
				r = t.getArray(t.$rows);
			e.Group().option({
				groupCols: n,
				dataIndx: r,
				agg: i
			}, null, "tp"), setTimeout(function() {
				t.refresh()
			})
		},
		onReceive: function(t, e) {
			if (this.getSortCancel()) return this.setSortCancel(!1);
			this.refreshGrid()
		},
		onOver: function(a) {
			return function(t, e) {
				var n = l(this),
					i = e.item,
					r = i.parent(),
					o = "removeClass",
					r = r[0] != n[0] && a.isDeny(r, n, i);
				e.helper.find(".ui-icon")[r ? "addClass" : o]("ui-icon-closethick")[r ? o : "addClass"]("ui-icon-check")
			}
		},
		onStop: function(r) {
			return function(t, e) {
				var n = l(this),
					e = e.item,
					i = e.parent();
				n[0] != i[0] && r.isDeny(n, i, e) && (n.sortable("cancel"), r.setSortCancel(!0))
			}
		},
		onTimer: function(t, e) {
			clearTimeout(i);
			var n = this;
			i = setTimeout(function() {
				n.onReceive(t, e)
			})
		},
		refresh: function() {
			this.that.element.is(":visible") ? (this.setHtml(), l(this.panes).sortable("refresh")) : this.pendingRefresh = !0
		},
		render: function() {
			var t = this,
				e = "." + t.clsSort,
				n = t.that;
			n.element && (t.panes = [t.$colsAll, t.$cols, t.$rows, t.$aggs], t.setHtml(), l(t.panes).sortable({
				appendTo: t.$ele,
				connectWith: e,
				distance: 5,
				containment: t.$ele,
				cursor: "move",
				items: "> .pq-pivot-col:not('.pq-deny-drag')",
				helper: function(t, e) {
					return e.clone(!0).css({
						opacity: "0.8"
					}).prepend("<span class='ui-icon-check ui-icon'></span>")
				},
				receive: t.onTimer.bind(t),
				stop: t.onStop(t),
				over: t.onOver(t),
				update: t.onTimer.bind(t),
				tolerance: "pointer"
			}), n._trigger("tpRender"))
		},
		setHtml: function() {
			var t, e, n = this,
				i = n.that,
				r = [],
				o = [],
				a = [],
				l = [],
				s = n.template,
				d = n.templateVals,
				c = {},
				u = i.options,
				i = i.iGroup,
				h = i.getColsPrimary(),
				f = i.getCMPrimary(),
				i = u.groupModel,
				p = i.dataIndx,
				g = i.groupCols,
				m = 0,
				v = f.length,
				w = n.$groupChk[0],
				x = n.$pivotChk[0];
			for (p.concat(g).forEach(function(t) {
					c[t] = 1
				}), w && (w.checked = i.on), x && (x.checked = i.pivot), n.showHideColPane(); m < v; m++) e = (t = f[m]).dataIndx, t.tpHide || c[e] || (t.summary && t.summary.type ? l.push(d(e, t)) : r.push(s(e, t)));
			p.forEach(function(t) {
				a.push(s(t, h[t]))
			}), g.forEach(function(t) {
				o.push(s(t, h[t]))
			}), n.$colsAll.html(r.join("")), n.$rows.html(a.join("") || n.ph(u.strTP_rowPH)), n.$cols.html(o.join("") || n.ph(u.strTP_colPH)), n.$aggs.html(l.join("") || n.ph(u.strTP_aggPH))
		},
		setAttrPanes: function() {
			this.$ele.attr("panes", this.panes.filter(function(t) {
				return t.is(":visible")
			}).length)
		},
		setHt: function() {
			this.$ele.height(this.$ele.parent()[0].offsetHeight), this.pendingRefresh && (this.pendingRefresh = !1, this.refresh())
		},
		setSortCancel: function(t) {
			this._sortCancel = t
		},
		setInit: function() {
			this._inited = !0
		},
		show: function() {
			this._hide(!1)
		},
		showHideColPane: function() {
			this.$colsPane.css("display", this.isHideColPane() ? "none" : ""), this.setAttrPanes()
		},
		template: function(t, e) {
			return ["<div data-di='", t, "' class='pq-pivot-col pq-border-2 ", e.tpCls || "", "'>", e.title, "</div>"].join("")
		},
		templateVals: function(t, e) {
			var n = e.summary.type;
			return ["<div data-di='", t, "' type='", n, "' class='pq-pivot-col pq-border-2 ", e.tpCls || "", "'>", n, "(", e.title, ")</div>"].join("")
		},
		toggle: function() {
			this._hide(this.isVisible())
		}
	}
}(jQuery), ! function(n) {
	pq.mixin.HeadTP = {
		getCM: function() {
			var t = this.that.options.strSelectAll || "Select All",
				e = this.nested;
			return [{
				editor: !1,
				dataIndx: "title",
				title: t,
				filter: {
					crules: [{
						condition: "contain"
					}]
				},
				type: e ? null : "checkbox",
				cbId: e ? null : "visible"
			}, {
				hidden: !0,
				dataIndx: "visible",
				dataType: "bool",
				editable: function(t) {
					return !t.rowData.pq_disable
				},
				cb: e ? null : {
					header: !0
				}
			}]
		},
		isToolPanel: function() {},
		getData: function() {
			var r = 1,
				o = this,
				a = "export" == o.tab,
				l = a ? "skipExport" : "hidden",
				t = o.that,
				e = o.isToolPanel() ? t.getOCMPrimary() : null,
				s = t.iRenderHead;
			return t.Columns().reduce(function(t) {
				var e = this.getColIndx({
						column: t
					}),
					n = !t[l],
					i = t.childCount;
				if (!t.menuInHide && (!t.collapsible || a)) return i && (o.nested = !0), {
					visible: i ? void 0 : n,
					get title() {
						return i ? t.title : s.getTitle(t, e) || t.dataIndx
					},
					column: t,
					id: r++,
					pq_disable: t.menuInDisable,
					pq_close: t.menuInClose,
					colModel: i ? t.colModel : void 0
				}
			}, e)
		},
		getGridObj: function(t) {
			var e = this.that;
			return n.extend({
				sideBar: "",
				dataModel: {
					data: this.getData()
				},
				rtl: e.options.rtl,
				colModel: this.getCM(),
				check: this.onChange.bind(this),
				treeExpand: this.onTreeExpand.bind(this),
				treeModel: this.nested ? {
					dataIndx: "title",
					childstr: "colModel",
					checkbox: !0,
					checkboxHead: !0,
					cbId: "visible",
					cascade: !0
				} : void 0
			}, e.options.menuUI.gridOptions, t)
		},
		onChange: function(t, e) {
			var i, r, n, o, a;
			e.init || (i = [], r = [], n = this.that, o = "export" == this.tab, a = [], (e.getCascadeList ? e.getCascadeList() : e.rows).forEach(function(t) {
				var t = t.rowData,
					e = t.visible,
					t = t.column,
					n = t.dataIndx;
				(t.colModel || []).length || (o ? (r.push(n), t.skipExport = !e) : (e ? i : a).push(n))
			}), o ? (n.refreshCM(), n._trigger("skipExport", null, {
				di: r
			})) : n.Columns().hide({
				diShow: i,
				diHide: a
			}))
		},
		onTreeExpand: function(t, e) {
			e.nodes.forEach(function(t) {
				t.column.menuInClose = e.close
			})
		}
	}
}(jQuery), ! function(d) {
	d.paramquery;

	function i(t) {
		this.that = t, this.rtl = t.options.rtl, t.on("headerCellClick", this.onHeadCellClick.bind(this)).on("destroy", this.onDestroy.bind(this))
	}
	d(document).on("pqGrid:bootup", function(t, e) {
		var n = e.instance;
		n.iHeaderMenu = new i(n), n.HeaderMenu = function() {
			return n.iHeaderMenu
		}
	}), i.prototype = d.extend({}, pq.mixin.HeadTP, {
		close: function() {
			this.$popup.remove()
		},
		popup: function() {
			return this.$popup
		},
		openFilterTab: function() {
			var t = this.menuH.tabs.findIndex(function(t) {
				return "filter" == t
			});
			return this.$tabs.tabs("option", "active", t), this.filterMenu
		},
		FilterMenu: function() {
			return this.filterMenu
		},
		onDestroy: function() {
			var t = this.$popup;
			t && t.remove(), delete this.$popup
		},
		onHeadCellClick: function(t, e) {
			var n = d(t.originalEvent.target);
			return n.hasClass("pq-icon-filter") ? this.onFilterClick(t, e, n) : n.hasClass("pq-icon-menu") || -1 == e.colIndx ? this.onMenuClick(t, e, n) : void 0
		},
		getMenuHtml: function(t) {
			var e = this.that.options.strMenu,
				n = {
					hideCols: "visible",
					filter: "filter",
					export: "download"
				},
				i = t.map(function(t) {
					return ['<li title="', e[t], '"><a href="#tabs-', t, '"><span class="pq-icon-tab-', n[t], '">&nbsp;</span></a></li>'].join("")
				}).join(""),
				t = t.map(function(t) {
					return '<div id="tabs-' + t + '"></div>'
				}).join("");
			return ["<div class='pq-head-menu pq-theme' dir='", this.rtl ? "rtl" : "ltr", "'>", "<div class='pq-tabs' style='border-width:0;'>", "<ul>", i, "</ul>", t, "</div>", "</div>"].join("")
		},
		getMenuH: function(t, e) {
			return d.extend({}, t.menuUI, (e || t.numberCell).menuUI)
		},
		activate: function(t, e) {
			var n, i = this.tabs,
				i = this.tab = i[t],
				t = d("#tabs-" + i);
			0 == t.children().length ? "hideCols" == i || "export" == i ? (n = this.$grid = d("<div/>").appendTo(t), pq.grid(n, this.getGridObj())) : "filter" == i && this.appendFilter(t, e) : t.find(".pq-grid").pqGrid("refresh")
		},
		open: function(t, e, n) {
			var i, r, o = this,
				a = o.that,
				l = a.options,
				s = a.columns[t],
				l = o.menuH = o.getMenuH(l, s),
				l = o.tabs = l.tabs;
			if (e = e || a.getCellHeader({
					dataIndx: t
				}), l && l.length) return t = o.$popup = d(o.getMenuHtml(l)).appendTo(document.body), l = l.length, i = localStorage["pq-menu-tab"] || 1, r = o.$tabs = t.find(".pq-tabs"), l - 1 < i && (i = l - 1), o.activate(i, s), pq.makePopup(t[0], null, function() {
				o.$popup = null, a.focusHead({
					ri: a.headerCells.length - 1,
					colIndx: a.colModel.indexOf(s)
				})
			}), r.tabs({
				active: i,
				activate: function(t, e) {
					i = d(this).tabs("option", "active"), localStorage["pq-menu-tab"] = i, o.activate(i, s)
				}
			}), t.resizable({
				handles: "e,w",
				maxWidth: 600,
				minWidth: 220
			}), t.position({
				my: "left top",
				at: "left bottom",
				of: n || e
			}), pq.focusEle(null, t), this
		},
		onMenuClick: function(t, e, n) {
			return this.open(e.dataIndx, t, n), !1
		},
		appendFilter: function(t, e, n, i) {
			var r = this.that,
				t = d("<div class='pq-filter-menu pq-theme'/>").appendTo(t),
				o = this.$popup || t,
				a = this.filterMenu = new pq.cFilterMenu(i),
				i = (this.filterPanel = i, {
					filterRow: n,
					grid: r,
					column: e,
					$popup: o,
					menuH: this.menuH || this.getMenuH(r.options, e)
				});
			return a.init(i), n = a.getHtml(), t.html(n), a.ready(t.children().get()), a.addEvents(), t
		},
		onFilterClick: function(t, e, n) {
			var i = e.column,
				r = this,
				o = r.that,
				e = r.$popup = this.appendFilter(d(document.body), i, !0);
			return pq.makePopup(e[0], null, function() {
				r.$popup = null, o.focusHead({
					ri: o.headerCells.length,
					colIndx: o.colModel.indexOf(i)
				})
			}), e.position({
				my: "left top",
				at: "left bottom",
				of: n
			}), pq.focusEle(null, e), !1
		}
	})
}(jQuery), ! function(u) {
	var t = pq.cFilterMenu = function(t) {
		this.filterPanel = t
	};
	(t.select = function(t, e, n) {
		this.that = t, this.filterPanel = n, this.di1 = "selected", this.grid = null, this.column = e
	}).prototype = {
		change: function(t) {
			this.onChange(t).call(this.grid)
		},
		create: function(t, n, e) {
			function i(t) {
				var e = n[t];
				e && e.call(r, o), r._trigger(t, null, o)
			}
			var r = this.that,
				e = this.getGridObj(n, e),
				o = u.extend({
					obj: e,
					column: this.column
				}, n);
			return i("selectGridObj"), e.rtl = r.options.rtl, o.grid = this.grid = pq.grid(t, e), i("selectGridCreated"), this.grid
		},
		getCM: function(t, e, n, i, r, o) {
			var a = t.dataIndx,
				o = u.extend({
					filter: {
						crules: [{
							condition: "contain"
						}]
					},
					align: "left",
					format: o.format || t.format,
					deFormat: t.deFormat,
					title: t.pq_title || t.title,
					dataType: t.dataType,
					dataIndx: a,
					editor: !1,
					useLabel: !0,
					renderLabel: this.getRenderLbl(i, a, this.that.options.strBlanks)
				}, n ? {} : {
					type: "checkbox",
					cbId: e
				});
			return n ? [o, {
				dataIndx: e,
				dataType: "bool",
				hidden: !0
			}, {
				dataIndx: n,
				hidden: !0
			}] : [o, {
				dataIndx: e,
				dataType: "bool",
				hidden: !0,
				cb: {
					header: !r,
					maxCheck: r
				}
			}]
		},
		getData: function(t, e) {
			var n = this.column,
				i = this.that,
				r = {},
				o = this.di1,
				a = n.dataIndx,
				l = t.maxCheck,
				e = pq.filter.getVal(e)[0],
				n = pq.filter.getOptions(n, t, i, !0);
			return u.isArray(e) ? l && (e = e.slice(0, l)) : e = 1 == l ? [e] : [], e.forEach(function(t) {
				r[t] = !0
			}), e.length ? n.forEach(function(t) {
				t[o] = r[t[a]]
			}) : n.forEach(function(t) {
				t[o] = !l
			}), n
		},
		getGridObj: function(t, e) {
			var n = this.column,
				i = this.that.options,
				r = n.filter,
				o = "gridOptions",
				a = t.groupIndx,
				l = t.maxCheck,
				s = this.di1,
				r = this.getData(t, r),
				d = r && r.length && null != r[0].pq_label ? "pq_label" : t.labelIndx;
			return this.filterUI = t, u.extend({
				colModel: this.getCM(n, s, a, d, l, t),
				check: this.onChange(!e),
				filterModel: "bool" === n.dataType ? {} : void 0,
				groupModel: a ? {
					on: !0,
					dataIndx: a ? [a] : [],
					titleInFirstCol: !0,
					fixCols: !1,
					indent: 18,
					checkbox: !0,
					select: !1,
					checkboxHead: !l,
					cascade: !l,
					maxCheck: l,
					cbId: s
				} : {},
				dataModel: {
					data: r
				}
			}, i.menuUI[o], i.filterModel[o], t[o], this.filterPanel ? {
				numberCell: {
					show: !1
				},
				height: "flex",
				maxHeight: 250,
				columnTemplate: {
					filter: {
						attr: 'placeholder="Search.."'
					}
				}
			} : {})
		},
		getRenderLbl: function(n, i, r) {
			return n === i && (n = void 0),
				function(t) {
					var t = t.rowData,
						e = t[n];
					return e || "" !== t[i] ? e : r
				}
		},
		onChange: function(o) {
			var a = this,
				t = a.filterUI,
				l = (t.maxCheck, t.condition);
			return function() {
				var e, n, i, t, r;
				o && (e = !1, n = a.column.dataIndx, i = a.di1, t = a.that, r = this.getData().filter(function(t) {
					t = t[i];
					return t || (e = !0), t
				}).map(function(t) {
					return t[n]
				}), e ? t.filter({
					oper: "add",
					rule: {
						dataIndx: n,
						condition: l,
						value: r
					}
				}) : t.filter({
					rule: {
						dataIndx: n,
						condition: l,
						value: []
					}
				}), a.refreshRowFilter())
			}
		},
		refreshRowFilter: function() {
			this.that.iRenderHead.postRenderCell(this.column)
		}
	}, t.prototype = {
		addEvents: function() {
			var t = this;
			t.$sel0.on("change", t.onSel1Change.bind(t)), t.$sel1.on("change", t.onSel2Change.bind(t)), t.$filter_mode.on("change", t.onModeChange.bind(t)), t.$clear.button().on("click", t.clear.bind(t)), t.$ok.button().on("click", t.ok.bind(t))
		},
		addEventsInput: function() {
			this.$inp && (this.$inp.filter("[type='checkbox']").off("click").on("click", this.onInput.bind(this)), this.$inp.filter("[type='text']").off("keyup").on("keyup", this.onInput.bind(this)))
		},
		clear: function() {
			var t = this.that,
				e = this.column,
				n = this.cond0,
				i = this.getType(n),
				e = e.dataIndx;
			t.filter({
				rule: {
					dataIndx: e,
					condition: i ? n : void 0
				},
				oper: "remove"
			}), this.refreshRowFilter(), this.ready()
		},
		close: function() {
			this.$popup.remove()
		},
		filterByCond: function(t) {
			var e, n, i, r, o, a, l, s = this,
				d = s.that,
				c = s.column.dataIndx,
				u = s.cond0,
				h = "" === u,
				f = s.cond1,
				p = s.filterRow;
			s.showHide(u, f), p || (e = s.getModeVal(), n = s.getType(u), i = (r = s.getVal(0))[0], r = r[1], o = (a = s.getVal(1))[0], a = a[1], l = s.$gridR), "select" == n ? (t && d.filter({
				oper: "add",
				rule: {
					dataIndx: c,
					condition: u,
					value: []
				}
			}), p || s.iRange.create(l, s.filterUI[0], s.btnOk)) : t && d.filter({
				oper: h ? "remove" : "add",
				rule: {
					dataIndx: c,
					mode: e,
					crules: [{
						condition: u,
						value: i,
						value2: r
					}, {
						condition: f,
						value: o,
						value2: a
					}]
				}
			})
		},
		getBtnOk: function() {
			return this.$ok
		},
		getInp: function(t) {
			return this["$inp" + t]
		},
		getSel: function(t) {
			return this["$sel" + t]
		},
		getBtnClear: function() {
			return this.$clear
		},
		getHtmlInput: function(t) {
			var e = this.column.dataIndx,
				t = this.filterUI[t < 2 ? 0 : 1];
			return "<input type='" + ("checkbox" == t.type ? "checkbox" : "text") + "' " + ["name='", e, "' class='", t.cls || "", "' style='width:100%;", t.style || "", "display:none;' ", t.attr || ""].join("") + " />"
		},
		getHtml: function() {
			function t(t, e) {
				return ["<div style='margin:0 auto 4px;'>", n.getHtmlInput(t), "</div>", "<div style='margin:0 auto 4px;'>", n.getHtmlInput(e), "</div>"].join("")
			}
			var n = this,
				e = n.column.filter,
				i = n.menuH,
				r = e.crules || [],
				e = r[0] || e,
				r = r[1] || {},
				o = n.that.options,
				e = n.cond0 = e.condition,
				r = n.cond1 = r.condition,
				a = n.filterRow,
				l = (n.readFilterUI(), pq.filter.getConditionsCol(this.column, n.filterUI[0]));
			return ["<div style='margin:8px auto;'>", " <select>", this.getOptionStr(l, e), "</select></div>", a ? "" : ["<div>", t(0, 1), "<div data-rel='grid' style='display:none;'></div>", i.singleFilter ? "" : ["<div class='filter_mode_div' style='text-align:center;display:none;margin:4px 0 4px;'>", "<label><input type='radio' name='pq_filter_mode' value='AND'/>", o.strAND, "</label>&nbsp;", "<label><input type='radio' name='pq_filter_mode' value='OR'/>", o.strOR, "</label>", "</div>", "<div style='margin:0 auto 4px;'><select>", this.getOptionStr(l, r, !0), "</select></div>", t(2, 3)].join(""), "</div>"].join(""), "<div style='margin:4px 0 0;'>", i.buttons.map(function(t) {
				return "<button data-rel='" + t + "' type='button' style='width:calc(50% - 4px);margin:2px;' >" + (o["str" + pq.cap1(t)] || t) + "</button>"
			}).join(""), "</div>"].join("")
		},
		getMode: function(t) {
			var e = this.$filter_mode;
			return 0 <= t ? e[t] : e
		},
		getModeVal: function() {
			return this.$filter_mode.filter(":checked").val()
		},
		getOptionStr: function(t, e, n) {
			var t = [""].concat(t),
				i = this,
				r = i.that.options.strConditions || {};
			return (t = n ? t.filter(function(t) {
				return "select" != i.getType(t)
			}) : t).map(function(t) {
				return '<option value="' + t + '" ' + (e == t ? "selected" : "") + ">" + (r[t] || t) + "</option>"
			}).join("")
		},
		getType: function(t) {
			return pq.filter.getType(t, this.column)
		},
		getVal: function(t) {
			var e, n, i = this.column,
				r = this["cond" + t],
				o = this["$inp" + (t ? "2" : "0")],
				a = o[0],
				t = this["$inp" + (t ? "3" : "1")];
			return o.is("[type='checkbox']") ? (n = a.indeterminate, n = !!a.checked || !!n && null) : (o.is(":visible") && (n = pq.deFormat(i, o.val(), r)), t.is(":visible") && (e = pq.deFormat(i, t.val(), r))), [n, e]
		},
		init: function(t) {
			var e = this.column = t.column;
			e.filter = e.filter || {}, this.that = t.grid, this.menuH = t.menuH, this.$popup = t.$popup, this.filterRow = t.filterRow
		},
		initControls: function() {
			var t = this.filterUI[0],
				e = this.that,
				n = {
					column: this.column,
					headMenu: !0
				};
			n.$editor = u([this.$inp0[0], this.$inp1[0]]), n.condition = this.cond0, n.type = t.type, (n.filterUI = t).init.find(function(t) {
				return t.call(e, n)
			}), t = this.filterUI[1], n.$editor = u([this.$inp2[0], this.$inp3[0]]), n.condition = this.cond1, n.type = t.type, (n.filterUI = t).init.find(function(t) {
				return t.call(e, n)
			})
		},
		isInputHidden: function(t) {
			if ("select" == t || !t) return !0
		},
		ok: function() {
			var t = this.cond0;
			"select" != this.getType(t) || this.filterRow ? t && this.filterByCond(!0) : this.iRange.change(!0), this.close(), this.refreshRowFilter()
		},
		onModeChange: function() {
			this.filterByCond(!this.btnOk)
		},
		onInput: function(t) {
			var t = u(t.target),
				e = !this.btnOk;
			t.is(":checkbox") && t.pqval({
				incr: !0
			}), this.filterByCond(e), e && this.refreshRowFilter()
		},
		onSel1Change: function() {
			var t = !this.btnOk;
			this.cond0 = this.getSel(0).val(), this.readFilterUI(), this.filterRow || (this.$inp0.replaceWith(this.getHtmlInput(0)), this.$inp1.replaceWith(this.getHtmlInput(1)), this.refreshInputVarsAndEvents(), this.initControls()), this.filterByCond(t), this.refreshRowFilter()
		},
		onSel2Change: function() {
			this.cond1 = this.getSel(1).val(), this.readFilterUI(), this.$inp2.replaceWith(this.getHtmlInput(2)), this.$inp3.replaceWith(this.getHtmlInput(3)), this.refreshInputVarsAndEvents(), this.initControls(), this.filterByCond(!this.btnOk)
		},
		ready: function(t) {
			this.node = t = t || this.node;
			var e, t = u(t),
				n = this,
				i = n.that,
				r = n.column,
				o = r.filter,
				a = o.crules || [],
				l = a[0] || o,
				a = a[1] || {},
				s = n.cond0 = l.condition,
				d = n.cond1 = a.condition,
				c = n.readFilterUI();
			n.iRange = new pq.cFilterMenu.select(i, r, n.filterPanel), i = n.getType(s), r = n.getType(d), e = n.$select = t.find("select"), n.$sel0 = u(e[0]).val(s), n.$sel1 = u(e[1]).val(d), n.$filter_mode = t.find('[name="pq_filter_mode"]'), n.$clear = t.find("[data-rel='clear']"), n.$ok = t.find("[data-rel='ok']"), n.btnOk = n.$ok.length, n.filterRow || (n.refreshInputVarsAndEvents(), n.$gridR = t.find("[data-rel='grid']"), n.$filter_mode.filter("[value=" + o.mode + "]").attr("checked", "checked"), n.$filter_mode_div = t.find(".filter_mode_div"), n.showHide(s, d), "select" == i ? n.iRange.create(n.$gridR, c[0], n.btnOk) : n.readyInput(0, i, l), n.readyInput(1, r, a), n.initControls())
		},
		readyInput: function(t, e, n) {
			var i = this.column,
				r = this["cond" + t],
				o = this["$inp" + (t ? "2" : "0")],
				t = this["$inp" + (t ? "3" : "1")];
			o.is(":checkbox") && o.pqval({
				val: n.value
			}), o.val(pq.formatEx(i, n.value, r)), "textbox2" == e && t.val(pq.formatEx(i, n.value2, r))
		},
		readFilterUI: function() {
			var t = this.filterUI = [],
				e = this.that,
				n = {
					column: this.column,
					condition: this.cond0,
					indx: 0,
					headMenu: !0
				};
			return t[0] = pq.filter.getFilterUI(n, e), n.condition = this.cond1, t[n.indx = 1] = pq.filter.getFilterUI(n, e), t
		},
		refreshInputVarsAndEvents: function() {
			var t = this.column,
				t = this.$inp = u(this.node).find("input[name='" + t.dataIndx + "']:not(.pq-search-txt)"),
				e = t[0],
				n = t[1],
				i = t[2],
				t = t[3];
			this.$inp0 = u(e), this.$inp1 = u(n), this.$inp2 = u(i), this.$inp3 = u(t), this.addEventsInput()
		},
		refreshRowFilter: function() {
			this.that.refreshHeaderFilter({
				dataIndx: this.column.dataIndx
			})
		},
		SelectGrid: function() {
			return this.$gridR.pqGrid("instance")
		},
		showHide: function(t, e) {
			var n, i, r, o, a;
			this.filterRow || (i = (n = this).$filter_mode_div, r = n.$sel1, o = n.getType(t), a = n.$inp, "select" === o ? (n.$gridR.show(), n.$gridR.hasClass("pq-grid") && n.$gridR.pqGrid("destroy"), a.hide(), i.hide(), r.hide()) : (n.$gridR.hide(), t ? (n.$inp0[n.isInputHidden(o) ? "hide" : "show"](), n.$inp1["textbox2" === o ? "show" : "hide"](), i.show(), r.show(), e ? (t = n.getType(e), n.$inp2[n.isInputHidden(t) ? "hide" : "show"](), n.$inp3["textbox2" === t ? "show" : "hide"]()) : (n.$inp2.hide(), n.$inp3.hide())) : (a.hide(), i.hide(), r.hide())))
		},
		updateConditions: function() {
			var t = this.column.filter;
			t.crules = t.crules || [{}], t.crules[0].condition = this.cond0, this.cond1 && (t.crules[1] = t.crules[1] || {}, t.crules[1].condition = this.cond1)
		}
	}
}(jQuery), ! function(M) {
	var n = M.paramquery;
	M(document).on("pqGrid:bootup", function(t, e) {
		new n.cEditor(e.instance)
	}), n.cEditor = function(i) {
		var r = this,
			o = r.setDims.bind(r);
		(r.that = i).on("editorBeginDone", function(t, e) {
			e.$td.addClass("pq-edited"), r.ui = e, r.setStyle(e), r.setDims();
			var n = e.editor.init;
			n && i.callFn(n, e), "grid" != e.editor.appendTo && i.on("assignTblDims scroll", o)
		}).on("editorEnd", function(t, e) {
			e.$td.removeClass("pq-edited"), i.off("assignTblDims scroll", o), delete r.ui
		})
	}, n.cEditor.prototype = {
		setStyle: function(t) {
			var e = t.$td,
				n = e.children("div"),
				i = e.css("background-color"),
				i = {
					fontSize: e.css("font-size"),
					fontFamily: e.css("font-family"),
					backgroundColor: i,
					color: e.css("color")
				};
			i.padding = parseInt(n.css("padding-top")) + 0 + "px " + (parseInt(n.css("padding-right")) + 0) + "px", t.$editor.css(i)
		},
		setDims: function() {
			var t, e, n, i, r = this.ui,
				o = this.that,
				a = r.rowIndxPage,
				l = r.colIndx,
				s = r.$td,
				d = s[0],
				c = o.iRenderB,
				u = (c.htContTop, c.wdContLeft),
				h = c.$cright[0],
				f = c.getCellCont(a, l)[0],
				p = c.getCellRegion(a, l),
				g = 0,
				p = ("right" == p && (g = u), "left" == p && 0, "tr" == p && (g = u), r.$editor),
				u = "textarea" == p[0].type,
				m = "true" == p[0].contentEditable,
				v = r.$cell,
				w = (c.getCellCoords(a, l), o.options),
				x = w.rtl,
				y = x ? "right" : "left",
				s = s.offset(),
				C = d.offsetWidth,
				d = d.offsetHeight,
				b = s.left,
				s = s.top,
				I = b + C,
				q = r.column,
				w = M.extend({}, w.editModel, q.editModel),
				q = v.parent(),
				_ = q.offset(),
				R = _.left,
				_ = _.top,
				q = q[0],
				D = q.offsetWidth,
				D = g < (D = x ? R + D - I : b - R) ? D : g,
				I = C - 2,
				b = d - 2,
				R = {
					minWidth: I
				};
			q == o.element[0] ? (t = {
				top: e = s - _
			})[y] = D : (C = (g = c.getCellCoords(a, l))[0], e = g[1] + 1 - f.scrollTop, D = C + 1 - (x ? -1 : 1) * f.scrollLeft, n = h.clientHeight - e, i = h.clientWidth - D, R.maxHeight = n, R.maxWidth = i, (t = {
				top: e
			})[y] = D), v.css(t), I = i < I ? i : I, R.minHeight = b = n < b ? n : b, R.width = I, u && (p.attr("rows") && (R.maxHeight = R.minHeight = void 0), p.attr("columns") && (R.maxWidth = R.minWidth = R.width = void 0)), p.css(M.extend(R, pq.styleObj(r.editor.style))), m && p.pqContent(w.saveKey != M.ui.keyCode.ENTER)
		}
	}
}(jQuery), ! function(t) {
	var e = t.paramquery,
		o = pq.grid,
		n = e.cProxy = function(t) {
			(this.that = t).options.reactive && this.init()
		};
	t(document).on("pqGrid:bootup", function(t, e) {
		e = e.instance;
		e.iProxy = new n(e)
	}), pq.isEqual = function(t, e) {
		if (pq.isObject(t)) {
			for (var n in t)
				if (!pq.isEqual(t[n], e[n])) return !1;
			return !0
		}
		return t === e
	}, pq.grid = function(t, e) {
		var n = o.apply(pq, arguments),
			i = n.iProxy,
			r = n.options;
		return r.reactive && (n.on("filter", function() {
			e.dataModel && (e.dataModel.data = r.dataModel.data), i.prxData()
		}), i.prxObj(e, i.onOption, !0)), n
	}, n.prototype = {
		init: function() {
			var t = this.that;
			this.prxData(), this.prxCM(), t.on("refresh", this.clear.bind(this)).on("dataReady", this.clearV.bind(this)).on("dataAvailable", this.clearDV.bind(this))
		},
		onOption: function(t, e) {
			var n, i = this.that,
				r = {},
				o = i.options;
			if (r[t] = e, i.element && !pq.isEqual(r, o))
				if (this.refresh(), pq.isObject(o[t]))
					if ("groupModel" == t) i.Group().option(e, !1), this.refreshView();
					else if ("treeModel" == t) i.Tree().option(e);
			else if ("sortModel" == t) i.sort(e);
			else
				for (n in "dataModel" == t ? (e.data && this.prxData(e.data), this.refreshDataView()) : "pageModel" != t || !e.rPP && null == e.type || this.refreshDataView(), e) i.option(t + "." + n, e[n]);
			else "colModel" == t ? this.prxCM(e) : "mergeCells" == t && this.refreshView(), i.option(t, e)
		},
		onCMChange: function() {
			var t = this,
				e = t.that;
			clearTimeout(t.CMtimer), t.CMtimer = setTimeout(function() {
				e.refreshCM(), t.refresh()
			}), e.one("CMInit", function() {
				clearTimeout(t.CMtimer)
			})
		},
		prxCM: function(t) {
			var e = this,
				n = e.that,
				t = t || n.options.colModel;
			t && (e.prxArray(t, e.onCMChange.bind(e)), t.forEach(function(t) {
				t.colModel && e.prxCM(t.colModel)
			}))
		},
		prxData: function(t) {
			var e = this,
				n = e.that,
				t = t || n.options.dataModel.data;
			t && e.prxArray(t, function() {
				clearTimeout(e.datatimer), e.datatimer = setTimeout(function() {
					e.refreshView()
				}), n.one("dataReady", function() {
					clearTimeout(e.datatimer)
				})
			})
		},
		prxArray: function(r, o) {
			var a = this,
				l = Array.prototype;
			"pop push reverse shift sort splice unshift".split(" ").forEach(function(i) {
				r[i] = function() {
					var t = arguments,
						e = "splice" == i,
						n = Object.getPrototypeOf(r)[i].apply(this, t);
					return "push" != i && !e && "unshift" != i || a.prxArrayObjs(e ? l.slice.call(t, 2) : t), o.call(a), n
				}
			}), a.prxArrayObjs(r)
		},
		prxArrayObjs: function(t) {
			for (var e = 0, n = t.length; e < n; e++) this.prxObj(t[e])
		},
		prxObj: function(t, e, n, i) {
			if (pq.isObject(t) && "tabModel" != i) {
				var r, o, a = "pq_proxy";
				for (o in t[a] || Object.defineProperty(t, a, {
						value: {},
						enumerable: !1
					}), (r = t[a]).__self = this, t) "pq_" != o.substr(0, 3) && (n && !i && pq.isObject(t[o]) && this.prxObj(t[o], e, n, o), r.hasOwnProperty(o) || (Object.defineProperty(r, o, Object.getOwnPropertyDescriptor(t, o)), this.defineProp(t, r, o, e, n, i)))
			}
		},
		defineProp: function(t, i, r, o, a, l) {
			Object.defineProperty(t, r, {
				get: function() {
					return i[r]
				},
				set: function(t) {
					var e, n = i.__self;
					a && !l && pq.isObject(t) && n.prxObj(t, o, a, r), i[r] = t, o ? (e = t, l && ((e = {})[r] = t), o.call(n, l || r, e)) : n.refresh()
				},
				enumerable: !0
			})
		},
		clear: function() {
			clearTimeout(this.timer)
		},
		clearV: function() {
			this.clear(), clearTimeout(this.timerV)
		},
		clearDV: function() {
			this.clearV(), clearTimeout(this.timerDV)
		},
		X: function(t, e) {
			var n = this;
			n[e] = setTimeout(function() {
				n.that.element && n.that[t]()
			})
		},
		refresh: function() {
			this.clear(), this.X("refresh", "timer")
		},
		refreshView: function() {
			this.clearV(), this.X("refreshView", "timerV")
		},
		refreshDataView: function() {
			this.clearDV(), this.X("refreshDataAndView", "timerDV")
		}
	}
}(jQuery), ! function(t) {
	t.widget("pq.drag", t.ui.mouse, {
		_create: function() {
			this._mouseInit()
		},
		_mouseCapture: function(t) {
			return this._trigger("capture", t), !0
		},
		_mouseStart: function(t) {
			return this._trigger("start", t), !0
		},
		_mouseDrag: function(t) {
			this._trigger("drag", t)
		},
		_mouseStop: function(t) {
			this._trigger("stop", t)
		}
	})
}(jQuery), ! function(w) {
	w(document).on("pqGrid:bootup", function(t, e) {
		var n = e.instance;
		n.iPic = new i(n), n.Pic = function() {
			return n.iPic
		}
	});
	var i = w.paramquery.cPic = function(n) {
		var i = this,
			r = n.options,
			t = i.rtl = r.rtl;
		i.id = 0, i.left = t ? "right" : "left", i.pics = [], (i.that = n).on("dataAvailable", function(t, e) {
			"filter" != e.source && (i.reset(), n.one("refresh", function() {
				i.addPics(r.pics)
			}))
		}).on("assignTblDims", i.refresh.bind(i))
	};
	i.prototype = {
		addPics: function(t) {
			var e = this;
			(t || []).forEach(function(t) {
				e.add(t.name, t.src, t.from, t.to, t.cx, t.cy, !0)
			})
		},
		create: function(t, e, n, i, r, o, a, l, s) {
			var d = this,
				c = new Image,
				i = {
					position: "absolute",
					top: i,
					zIndex: 5
				},
				u = w(c);
			c.src = e, i[d.left] = n, t.append(c), (e = u.attr({
				draggable: !1,
				"pic-id": s,
				tabindex: 1
			}).css({
				height: o,
				width: r,
				cursor: "move"
			}).on("focus", function() {
				w(l).css({
					outline: "2px dotted #999"
				})
			}).on("keydown", function(t) {
				t.keyCode == w.ui.keyCode.DELETE && d.remove(d.getId(this))
			}).on("blur", function() {
				w(l).css({
					outline: ""
				})
			}).resizable({
				resize: d.onResize(d, l, a)
			}).parent(".ui-wrapper").css(i)).find(".ui-resizable-se").removeClass("ui-icon"), n = d.drag(e, l, a), u.drag({
				distance: 3,
				capture: function() {
					u.focus()
				},
				start: n.start,
				drag: n.drag,
				stop: n.stop
			}), l.push(e[0])
		},
		drag: function(e, s, r) {
			function d(t) {
				return parseInt(e.css(t))
			}
			var c, u = this,
				h = u.that,
				t = h.iRenderB,
				f = r.cx,
				p = r.cy,
				o = t.leftArr,
				a = t.topArr,
				g = o[o.length - 1],
				m = a[a.length - 1],
				v = t.numColWd;
			return {
				start: function(t) {
					c = {
						pageX: t.pageX,
						pageY: t.pageY,
						scrollX: h.scrollX(),
						scrollY: h.scrollY()
					}
				},
				drag: function(t) {
					var e = h.scrollX(),
						n = h.scrollY(),
						i = (t.pageX + e - c.pageX - c.scrollX) * (u.rtl ? -1 : 1),
						r = t.pageY + n - c.pageY - c.scrollY,
						o = d(u.left),
						a = d("top"),
						l = {};
					c.pageX = t.pageX, c.scrollX = e, c.pageY = t.pageY, c.scrollY = n, o + i - v < 0 ? i = v - o : g + v < o + i + f && (i = g + v - o - f), a + r < 0 ? r = 0 - a : m < a + i + p && (r = m - a - p), l.top = a + r, l[u.left] = o + i, w(s).css(l)
				},
				stop: function() {
					var t = d(u.left) - v,
						e = d("top"),
						n = u.findIndx(o, t),
						i = u.findIndx(a, e);
					r.from = [n, t - o[n], i, e - a[i]]
				}
			}
		},
		onResize: function(t, r, o) {
			return function(t, e) {
				var n = e.size.height,
					e = e.size.width,
					i = {
						height: n,
						width: e
					};
				w(r).css(i), w(r).find("img").css(i), delete o.to, o.cx = e, o.cy = n
			}
		},
		getPos: function(t) {
			var e = this.that.iRenderB,
				n = +t[2],
				i = +t[0],
				e = e.getCellXY(n, i);
			return [e[0] + t[1], e[1] + t[3]]
		},
		name: function(t) {
			return t.replace(/[^0-9,a-z,A-Z,_\.]/g, "_")
		},
		refresh: function() {
			var i = this,
				r = i.that.widget();
			i.pics.forEach(function(t) {
				var e = t.from,
					t = t.id,
					e = i.getPos(e),
					n = e[0],
					e = {
						top: e[1]
					},
					t = r.find("[pic-id=" + t + "]").parent();
				e[i.left] = n, t.css(e)
			})
		},
		add: function(i, r, o, a, e, n, l) {
			var s, d, c, u, t, h, f, p, g, m, v, w = this;
			if (r) return "data:" != r.substr(0, 5) ? (i = i || r.split("/").pop(), pq.urlToBase(r, function(t) {
				w.add(i, t, o, a, e, n, l)
			})) : (s = w.that, d = s.iRenderB, t = w.getPos(o), c = t[0], u = t[1], p = [], g = w.id++, v = function(e, n) {
				(f = {
					name: i,
					src: r,
					get from() {
						var t = this._from;
						return [s.getColIndx({
							column: t[0]
						}), t[1], t[2].pq_ri, t[3]]
					},
					set from(t) {
						this._from = [s.colModel[t[0]], t[1], s.getRowData({
							rowIndx: t[2]
						}), t[3]]
					},
					cx: e,
					cy: n,
					id: g
				}).from = o, ["$cright", "$cleft", "$clt", "$ctr"].forEach(function(t) {
					w.create(d[t], r, c, u, e, n, f, p, g)
				}), w.pics.push(f), l || s.iHistory.push({
					callback: function(t) {
						t ? g = w.add(i, r, o, a, e, n, !0) : w.remove(g, !0)
					}
				}), s._trigger("picAdd")
			}, a && a.length ? (t = a[0], h = a[2], t = (h = d.getCellXY(h, t))[0] + a[1], h = h[1] + a[3], v(t - c, h - u)) : n ? v(e, n) : ((m = new Image).onload = function() {
				v(m.width, m.height)
			}, m.src = r)), g
		},
		findIndx: function(t, e) {
			return t.findIndex(function(t) {
				return e < t
			}) - 1
		},
		getId: function(t) {
			return w(t).attr("pic-id")
		},
		remove: function(e, t) {
			var n, i = this,
				r = i.that,
				o = i.pics.findIndex(function(t) {
					return t.id == e
				});
			r.widget().find("[pic-id=" + e + "]").remove(), n = i.pics.splice(o, 1)[0], t || r.iHistory.push({
				callback: function(t) {
					t ? i.remove(e, !0) : e = i.add(n.name, n.src, n.from, n.to, n.cx, n.cy, !0)
				}
			})
		},
		reset: function() {
			this.that.widget().find("[pic-id]").remove(), this.pics.length = 0, this.id = 0
		}
	}
}(jQuery), ! function(l) {
	var s, d, c, u, o = l.fn.val,
		n = l.fn.select;

	function h() {
		return window.getSelection()
	}

	function f() {
		return document.createRange()
	}

	function p(t) {
		function e() {
			var t = document.createElement("br");
			i.insertNode(t), i.setStartAfter(t)
		}
		var n = t.childNodes,
			i = h().getRangeAt(0),
			r = i.startContainer,
			o = i.startOffset;
		(!n.length || r == t && n[o - 1] && 3 == n[o - 1].nodeType || 3 == r.nodeType && r.textContent.length == o && null == r.nextSibling) && e(), e()
	}

	function t(t) {
		var e = h().getRangeAt(0),
			n = f();
		return e.startContainer == t ? [e.startOffset, t] : (n.selectNodeContents(t), n.setEnd(e.startContainer, e.startOffset), [n.toString().length])
	}

	function g() {
		s[++u] = {
			indx: t(d),
			dom: d.cloneNode(!0)
		}
	}

	function m() {
		! function n(t, e) {
			{
				var i, r;
				if (s[u]) return t = l(t.childNodes).toArray(), i = l(e || s[u].dom.childNodes).toArray(), r = !1, t.length != i.length || (t.forEach(function(t, e) {
					r || (e = i[e], t.nodeName != e.nodeName || 3 == t.nodeType && t.nodeValue.split(/\s/).length != e.nodeValue.split(/\s/).length ? r = !0 : t.childNodes && t.childNodes.length && (r = n(t, e)))
				}), r)
			}
		}(d) ? (s[u].dom = d.cloneNode(!0), s[u].indx = t(d)) : g()
	}
	l.fn.val = function(t) {
		var e, n, i, r = this[0];
		return r && "true" == r.contentEditable ? arguments.length ? (null != t && (r.innerHTML = pq.escapeHtml(t + "").replace(/(\r\n|\r|\n)/g, "<br>"), e = r, n = h(), i = f(), e.lastChild && (n.removeAllRanges(), i.setStartAfter(e.lastChild), n.addRange(i))), this) : (e = (e = r.innerHTML).replace(/<br[^>]*>/g, "\n"), l("<p>").html(e).text()) : o.apply(this, arguments)
	}, l.fn.select = function() {
		var t, e = this[0];
		e && "true" == e.contentEditable ? (e = document.createRange(), t = window.getSelection(), e.selectNodeContents(this[0]), t.removeAllRanges(), t.addRange(e)) : n.call(this)
	}, l.fn.pqContent = function(o) {
		var a = d = this[0],
			t = "pq-content";
		this.hasClass(t) || (c = this.attr("dataType"), s = [], u = -1, this.addClass(t).on("keydown", function(t) {
			var e, n, i, r;
			if (s.length || g(), 13 != t.keyCode || c && 0 != c.indexOf("string") && "html" != c ? t.ctrlKey && (90 == t.keyCode ? (0 < u && (u--, e = 1), i = 1) : 89 == t.keyCode && (u < s.length - 1 && (u++, e = 1), i = 1), e && (n = s[u], r = n.dom.childNodes, d.innerHTML = "", l(r).toArray().forEach(function(t) {
					d.appendChild(t.cloneNode(!0))
				}), function r(t, o, e) {
					if (e != t) return l(t.childNodes).toArray().forEach(function(t) {
						var e, n, i;
						0 <= o && ("#TEXT" == t.nodeName.toUpperCase() ? (e = t.textContent).length >= o ? (n = f(), i = h(), n.setStart(t, o), n.collapse(!0), i.removeAllRanges(), i.addRange(n), o = -1) : o -= e.length : o = r(t, o))
					}), o;
					var e = f(),
						n = h();
					e.setStart(t, o), e.collapse(!0), n.removeAllRanges(), n.addRange(e)
				}(a, n.indx[0], n.indx[1]))) : ((t.altKey || o) && p(a), i = !0), e || m(), i) return !1
		}))
	}
}(jQuery), ! function(c) {
	c(document).on("pqGrid:bootup", function(t, e) {
		var n = e.instance;
		n.iRowResize = new i(n), n.RowResize = function() {
			return n.iRowResize
		}
	});
	var i = c.paramquery.cRowResize = function(t) {
		this.that = t, this.ht = 8, t.options.rowResize && t.on(!0, "cellMouseDown", this.onCellDown.bind(this)).on("cellMouseEnter", this.onCellEnter.bind(this))
	};
	i.prototype = {
		onCellDown: function(t, e) {
			if (-1 == e.colIndx) {
				var n = t.pageY,
					i = t.currentTarget,
					r = c(i);
				if (n >= r.offset().top + i.offsetHeight - this.ht) return this.createDrag(r, e), (n = c.Event("mousedown", t)).type = "mousedown", r.trigger(n), !1;
				r.draggable("instance") && r.draggable("destroy")
			}
		},
		onCellEnter: function(t, e) {
			-1 == e.colIndx && (e = "pq-row-resize", t = c(t.currentTarget), this.drag || t.find("." + e).length || t.append("<div class='" + e + "' style='position:absolute;height:" + (this.ht - 1) + "px;bottom:0;left:0;width:100%;cursor:row-resize;'></div>"))
		},
		createDrag: function(t, e) {
			var n, i = this,
				r = i.that,
				o = e.rowData,
				a = e.rowIndxPage,
				l = r.iRenderB,
				s = r.$cont,
				d = "width:100%;background-color:#000;height:1px;";
			t.hasClass("ui-draggable") || t.on("dblclick", function() {
				delete o.pq_htfix, l.autoHeight({})
			}).draggable({
				axis: "y",
				cursor: "row-resize",
				cursorAt: {
					top: -2
				},
				start: function(t) {
					i.drag = !0, n = t.pageY, i.$top = c("<div style='" + d + "position:absolute;top:" + (l.getTop(a) - l.scrollY()) + "px;'></div>").appendTo(s)
				},
				helper: function() {
					return c("<div style='" + d + "'></div>").appendTo(s)
				},
				stop: function(t) {
					i.drag = !1;
					var t = t.pageY - n,
						e = l.rowhtArr;
					i.$top.remove(), o.pq_ht = Math.max(e[a] + t, 10), o.pq_htfix = !0, r.refresh()
				}
			})
		}
	}
}(jQuery), ! function(d) {
	d(document).on("pqGrid:bootup", function(t, e) {
		var e = e.instance,
			n = e.options;
		"lazy" == n.dataModel.location && (e.iLazy = new i(e, n))
	});
	var i = d.paramquery.Lazy = function(t, e) {
		var n = this;
		n.grid = t, n.rpp = e.pageModel.rPP, t.on("scrollEnd", n.onScroll.bind(n)).on("customSort", n.customSort.bind(n)).on("customFilter", n.customFilter.bind(n)).on("lazyProgress", n.progress.bind(n)).on("lazyComplete", n.onComplete.bind(n))
	};
	i.prototype = {
		init: function(t) {
			var e = this,
				n = e.grid,
				i = n.getQueryString(t = t || {});
			e.dataURL = i.dataURL, e.url = i.url, n._trigger("lazyInit", null, t), e.totalRecords = null, e.cachedPages = [], e.data = null, e.complete = !1, e.xhr && e.xhr.abort(), e.bars = [], e.request(t)
		},
		customSort: function(t, e) {
			if ("local" == this.grid.option("sortModel.type") && !this.complete) return !1
		},
		customFilter: function(t, e) {
			var n = this.complete,
				i = this.grid;
			if ("local" == i.option("filterModel.type") && !n) return e.dataTmp = i.options.dataModel.data, e.dataUF = [], e.trigger = !1
		},
		progBar: function() {
			var t = this.grid,
				e = this.bars,
				n = t.options.dataModel,
				i = t.iTab,
				n = (t = n.progressAcrossTabs ? i.grid(i.activeTab()) : t).widget().find(".pq-grid-pbar")[0];
			return -1 == e.indexOf(n) && e.push(n), d(e)
		},
		progress: function(t, e) {
			var n = this.progBar(),
				i = e.percent + "%";
			n.show().stop().animate({
				width: i
			}, {
				always: function() {
					n.css({
						width: i
					})
				}
			})
		},
		onComplete: function(t, e) {
			var n = this.progBar();
			n.animate({
				width: "100%"
			}, {
				complete: function() {
					n.css({
						width: 0
					}).hide()
				}
			}), this.grid._onDataAvailable(e)
		},
		onScroll: function() {
			this.complete || this.request()
		},
		triggerProgress: function() {
			var e = 0,
				t = this.cachedPages;
			t.forEach(function(t) {
				t && e++
			}), this.grid._trigger("lazyProgress", null, {
				percent: Math.round(100 * e / t.length, 2)
			})
		},
		triggerComplete: function(t) {
			var e = this.grid;
			this.complete || (this.complete = !0, e._trigger("lazyComplete", null, t))
		},
		request: function(c) {
			c = c || {};
			var t, e, u, n, h = this,
				f = h.grid,
				i = f.options.pageModel,
				r = f.getViewPortIndx(),
				p = r.initV,
				o = h.dataURL,
				a = p,
				l = h.data,
				g = h.rpp,
				m = h.cachedPages,
				v = h.totalPages,
				s = r.finalV;
			if (l && null != p) {
				for (; a <= s; a++)
					if (l[a] && l[a].pq_empty) {
						u = n = Math.floor(a / g) + 1;
						break
					} if (!u)
					for (t = e = Math.floor(p / g) + 1, a = 0; a <= v; a++) {
						if (0 == m[t]) {
							n = t;
							break
						}
						if (0 == m[e]) {
							n = e;
							break
						}
						t--, e++
					}
			} else n = 1;
			if (!n) return h.triggerComplete(c), !1;
			i.curPage = n, h.xhr && h.xhr.abort(), o = d.extend(o, {
				pq_curpage: n,
				pq_rpp: i.rPP
			}), f.callXHR(h.url, o, function(t, e, n) {
				var i, r = t.data,
					o = t.totalRecords,
					a = r.length,
					l = a,
					t = t.curPage,
					s = h.data = h.data || [],
					d = (t - 1) * h.rpp;
				if (null == h.totalRecords) {
					for (i = !0; l < o; l++) s[l + d] = {
						pq_empty: !0
					};
					for (h.totalRecords = o, v = h.totalPages = Math.ceil(o / g), l = 1; l <= v; l++) m[l] = !1;
					f.option("dataModel.data", s)
				}
				for (m[t] = !0, l = 0; l < a; l++) s[l + d] = r[l], s[l + d].pq_empty = !1;
				i ? f.refreshView({
					header: c.header,
					trigger: !1,
					triggerQueue: !1,
					group: !1
				}) : u && f.refresh({
					header: !1
				}), null != p ? 0 != h.request(c) && h.triggerProgress() : h.triggerComplete(c)
			})
		}
	}
}(jQuery), ! function(g) {
	g.fn.pqColorPick = function(t) {
		t = t || {};
		var e, r, n, i = this,
			o = g(document.body),
			a = g.paramquery.strings,
			l = t.title || "",
			s = a.strApply;

		function d() {
			n = e = r = null
		}

		function c(t) {
			p(t, 1, 2, 0), p(t, 3, 2, 1), p(t, 5, 2, 2)
		}

		function u() {
			var t = e.val().trim();
			if (t.match(/^#[0-9,A-F]{6}/i)) return t
		}

		function h() {
			var t = "#" + ["red", "green", "blue"].map(function(t) {
				t = f(".pq-cp-" + t);
				return 1 == (t = t.slider("value").toString(16)).length ? "0" + t : t
			}).join("");
			f(".pq-cp-output").css("background-color", t), e.val(t)
		}

		function f(t) {
			return n.find(t)
		}

		function p(t, e, n, i) {
			t = parseInt(t.substr(e, n), 16), g(r[i]).slider("value", t)
		}
		return i.on("click", function() {
			return n ? n.is(":hidden") ? n.show() : n.hide() : (n = g(`<div class="pq-theme pq-color-picker">
                                <div class="pq-cp-title">${l}</div>
                                <div style="float:left;width:75%;">
                                       <div class="pq-cp-red pq-slider" ></div>
                                       <div class="pq-cp-green pq-slider"></div>
                                       <div class="pq-cp-blue pq-slider"></div>    
                                       <input type="text" class="pq-cp-input" />
                                       <button type="button">${s}</button>
                                </div>
                                <div class="pq-cp-output ui-widget-content"></div>
                                <div style="clear:both;">
                                </div>
                         </div>`).appendTo(o), e = f(".pq-cp-input").on("input", function() {
				var t = u();
				t && c(t)
			}), n.find("button").button().on("click", function() {
				var t = u();
				t && i.val(t).trigger("change"), n.hide(), i.focus()
			}), pq.makePopup(n[0], i[0], d), n.position({
				my: "left top",
				at: "left bottom",
				of: i
			}), r = f(".pq-slider").slider({
				max: 255,
				range: "min",
				animate: !0,
				slide: h,
				change: h
			})), n.is(":visible") && (pq.focusEle(!1, n), c(i.val()), h()), !1
		}), i
	}
}(jQuery), ! function(m) {
	m.fn.pqBorder = function(t) {
		var e, n, i, r, o, a = this,
			l = (t = t || {}).grid || a.closest(".pq-grid").pqGrid("instance"),
			s = m(document.body),
			t = t.borders || ["all", "outer", "inner", "vertical", "horizontal", "left", "right", "top", "bottom", "none"],
			d = m.paramquery.strings,
			c = {
				vertical: "middle",
				horizontal: "center"
			},
			u = t.map(function(t, e) {
				var n = d[pq.camelCase("str-" + t)];
				return "<div tabindex=0 data-border='" + t + "' class='pq-border-0 pq-bp-button " + ("bi-border" + ("none" == t ? "" : "-" + (c[t] || t))) + "' title = '" + n + "'>&nbsp;</div>" + (4 == e ? "<br/>" : "")
			}).join("");

		function h() {
			r = o = n = null
		}

		function f() {
			o = null
		}

		function p(t) {
			return r.find(t)
		}

		function g() {
			o ? o[o.is(":hidden") ? "show" : "hide"]() : o = pq.Select({
				noBorderSelection: !0,
				noBorderFocus: !0,
				colModel: [{
					style: "padding-top:10px;",
					width: 120,
					render: function(t) {
						return "<div style='border-bottom:" + t.cellData + ";'></div>"
					}
				}, {
					width: 28,
					noFocus: !0,
					minWidth: 28,
					render: function(t) {
						return t.rowData[0] == i ? "<span class='ui-icon-check'></span>" : ""
					}
				}],
				dataModel: {
					data: [
						["1px solid"],
						["2px solid"],
						["3px solid"],
						["1px dotted"],
						["1px dashed"],
						["3px double"]
					]
				},
				cellClickE: function(t, e) {
					i = e.rowData[0], a.data("style", i), n.find("div").css("border-bottom", i), setTimeout(function() {
						n.focus(), o.remove(), o = null
					})
				},
				create: function() {
					this.widget().addClass("pq-bp-style-grid")
				}
			}, n, f), o.is(":visible") && pq.focusEle(!1, o)
		}
		a.on("click", function() {
			e = a.data("color") || "#000000", i = a.data("style") || "1px solid", r ? r.is(":hidden") ? r.show() : r.hide() : (r = m(`<div class="pq-theme pq-border-picker">                                
                                <div style="float:left;width:75%;">${u}
                                </div>                 
                                <div style="float:right;width:22%;">
                                    <div tabindex=0 class="pq-border-0 pq-bp-button pq-bp-style" title = '${d.strBorderStyle}'>
                                        <div style="border-bottom:${i};"></div>
                                        <span class='ui-icon-triangle-1-s' style=""></span>
                                    </div>
                                    <br/>
                                    <input type=color value='${e}' class='pq-bp-button' title = '${d.strBorderColor}' />
                                </div>
                                <div style="clear:both;">
                                </div>
                         </div>`).appendTo(s), p(".pq-bp-button").on("pq:clickE", function(t) {
				t = m(t.target).data("border");
				t && (l.Selection().border(t, i, e), r.hide(), setTimeout(function() {
					a.focus()
				}))
			}), p("input").pqColorPick({
				title: d.strBorderColor
			}).on("change", function() {
				e = m(this).val(), a.data("color", e)
			}), n = p(".pq-bp-style").on("pq:clickE", g), pq.makePopup(r[0], a[0], h, ".pq-color-picker,.pq-bp-style-grid"), r.position({
				my: "left top",
				at: "left bottom",
				of: a
			})), r.is(":visible") && pq.focusEle(!1, r)
		})
	}
}(jQuery), ! function(g) {
	var m = pq.cVirtual = function() {
		this.diffH = 0, this.diffV = 0
	};
	m.setSBDim = function() {
		var t = g("<div style='max-width:100px;height:100px;position:fixed;left:0;top:0;overflow:auto;visibility:hidden;'><div style='width:200px;height:100px;'></div></div>").appendTo(document.body),
			e = t[0];
		this.SBDIM = e.offsetHeight - e.clientHeight, t.remove()
	}, m.prototype = {
		assignTblDims: function(t) {
			var e = this,
				n = e.isBody(),
				i = e.getTopSafe(this[t ? "cols" : "rows"], t, !0),
				r = e.maxHt,
				r = (r < i ? (e[t ? "ratioH" : "ratioV"] = i / r, e[t ? "virtualWd" : "virtualHt"] = i, i = r) : (i = i || (e.isHead() ? 0 : 1), e[t ? "ratioH" : "ratioV"] = 1), e.$tbl_right[0]),
				o = e[t ? "$tbl_tr" : "$tbl_left"],
				o = o.length ? o[0] : {
					style: {}
				},
				a = t ? "width" : "height";
			r.style[a] = i + "px", o.style[a] = i + "px", r = n ? "Tbl" : e.isHead() ? "TblHead" : "TblSum", !n && t && e.$spacer.css(e.rtl, i), e.dims[t ? "wd" + r : "ht" + r] = i, n && e.triggerTblDims(100)
		},
		calInitFinal: function(t, e, n) {
			var i, r, o, a = this[n ? "cols" : "rows"],
				l = this[n ? "freezeCols" : "freezeRows"],
				s = this[n ? "leftArr" : "topArr"],
				d = this.getTopSafe(l, n);
			if (0 == this.that.options[n ? "virtualX" : "virtualY"]) return [l, a - 1];
			if (l == a) return [0, l - 1];
			if (n && (d -= this.numColWd), t += d, e += d, l < a && s[l] < t) {
				for (var c, u = 30, h = a; u--;)
					if (s[c = Math.floor((l + h) / 2)] >= t) h = c;
					else {
						if (l == c) {
							o = !0;
							break
						}
						l = c
					} if (!o) throw "ri not found"
			}
			for (; l <= a; l++)
				if (s[l] > t) {
					i = l && l - 1;
					break
				} for (; l <= a; l++)
				if (s[l] > e) {
					r = l - 1;
					break
				} return null == i && null == r && a && t > s[a - 1] ? [null, null] : [i = null == i ? 0 : i, r = null == r ? a - 1 : r]
		},
		calInitFinalSuper: function() {
			var t = this.dims || {},
				e = this.calcTopBottom(),
				n = e[0],
				i = e[1],
				e = e[2],
				r = this.calcTopBottom(!0),
				o = r[0],
				a = r[1],
				l = this.calInitFinal(n, i),
				s = l[0],
				l = l[1],
				d = this.calInitFinal(o, a, !0),
				c = d[0],
				d = d[1];
			return this.isBody() && (t.bottom = i, t.top = n, t.left = o, t.right = a), [s, c, l, d, e || r[2]]
		},
		calcTopBottom: function(t) {
			var e, n, i, r, o, a = this,
				l = a.isBody(),
				s = a.dims,
				d = a.virtualWin,
				c = a.$cright,
				u = c[0],
				c = t ? (h = pq.scrollLeft(u), i = a.sleft, r = s.wdCont, o = a.wdContLeft, a.ratioH) : (d && (p = g(window).scrollTop() - c.offset().top), h = d ? a._calcTop(u, p) : u.scrollTop, i = a.stop, r = a.htCont, o = a.htContTop, a.ratioV),
				h = h < 0 ? 0 : h;
			if (1 == c) return n = h + r - o, [h, n = 0 <= (n = t || !d ? n : a._calcBot(h, n, p)) ? n : 0];
			var f, u = a[t ? "virtualWd" : "virtualHt"],
				d = t ? s.wdContClient : s.htContClient,
				s = t ? "diffH" : "diffV",
				p = a[s];
			if (m.maxHt <= h + d ? e = (n = u - o + (r - d)) - r + o : n = (e = 0 == h ? 0 : h * (u = null == i || Math.abs(h - i) > r ? c : 1) + (1 == u && p ? p : 0)) + r - o, (d = e - h) != p && (f = !0, a[s] = d, l && a.triggerTblDims(3e3)), !(0 <= (a[t ? "sleft" : "stop"] = h))) throw "stop NaN";
			if (0 <= n && 0 <= e) return [e, n, f];
			throw "top bottom NaN"
		},
		_calcTop: function(t, e) {
			return t.scrollTop + (0 < e ? e : 0)
		},
		_calcBot: function(t, e, n) {
			t = t + g(window).height() + (n < 0 ? n : 0);
			return t < e ? t : e
		},
		getHtDetail: function(t, e) {
			t = t.pq_detail;
			return t && t.show ? t.height || e : 0
		},
		getTop: function(t, e) {
			var n = this.topArr[t],
				e = e ? 0 : this.diffV;
			if (0 <= (n = e && (n -= t > this.freezeRows ? e : 0) < 0 ? 0 : n)) return n;
			throw n
		},
		getTopSafe: function(t, e, n) {
			var i = e ? this.cols : this.rows;
			return this[e ? "getLeft" : "getTop"](i < t ? i : t, n)
		},
		getLeft: function(t, e) {
			var n = this.numColWd,
				i = this.leftArr,
				r = i.length - 1,
				r = r < t ? r : t,
				t = -1 == r ? 0 : i[r] + n,
				i = e ? 0 : this.diffH;
			if (0 <= (t = i && (t -= r > this.freezeCols ? i : 0) < 0 ? 0 : t)) return t;
			throw t
		},
		getHeightR: function(t, e) {
			var n = this.topArr,
				e = n[t + (e = e || 1)] - n[t];
			if (0 <= e) return e;
			throw e
		},
		getHeightCell: function(t, e) {
			e = e || 1;
			var n = this.topArr,
				i = this.rowHtDetail,
				i = i ? this.getHtDetail(this.data[t + e - 1], i) : 0,
				e = n[t + e] - n[t] - i;
			if (0 <= e) return e;
			throw e
		},
		getHeightCellM: function(t, e) {
			return this.getTopSafe(t + e) - this.getTop(t)
		},
		getHeightCellDirty: function(t, e) {
			return this.setTopArr(t, null, t + e), this.getHeightCellM(t, e)
		},
		getWidthCell: function(t) {
			if (-1 == t) return this.numColWd;
			t = this.colwdArr[t];
			if (0 <= t) return t;
			throw t
		},
		getWidthCellM: function(t, e) {
			return this.getTopSafe(t + e, !0) - this.getLeft(t)
		},
		initRowHtArr: function() {
			var t, e = this.rowHt,
				n = this.data,
				i = n.length,
				r = this.rowHtDetail,
				o = this.rowhtArr = [],
				a = (this.topArr = [], 0);
			if (r)
				for (; a < i; a++) t = n[a], o[a] = t.pq_hidden ? 0 : t.pq_ht || e + this.getHtDetail(t, r);
			else
				for (; a < i; a++) t = n[a], o[a] = t.pq_hidden ? 0 : t.pq_ht || e
		},
		initRowHtArrDetailSuper: function(t) {
			var e, n = this.rowhtArr,
				i = this.data;
			t.forEach(function(t) {
				e = t[0], n[e] = i[e].pq_ht = n[e] + t[1]
			}), this.setTopArr(), this.assignTblDims()
		},
		initRowHtArrSuper: function() {
			this.initRowHtArr(), this.setTopArr(), this.assignTblDims()
		},
		refreshRowHtArr: function(t, e) {
			var n = this.data[t],
				i = this.rowHtDetail,
				r = this.rowHt;
			this.rowhtArr[t] = n.pq_hidden ? 0 : r + this.getHtDetail(n, i), e && (this.setTopArr(t), this.assignTblDims())
		},
		setTopArr: function(t, e, n) {
			for (var i, r, o = t || 0, a = e ? (i = this.cols, r = this.colwdArr, this.leftArr) : (i = this.rows, r = this.rowhtArr, this.topArr), l = n && n < i ? n : i - 1, s = o ? a[o] : 0; o <= l; o++) a[o] = s, s += r[o];
			a[o] = s, a.length = i + 1
		},
		triggerTblDims: function(t) {
			var e = this;
			e.setTimer(function() {
				e.that._trigger("assignTblDims")
			}, "assignTblDims", t)
		}
	}
}(jQuery), ! function(i) {
	var r = 1533910;
	i(document).one("pq:ready", function() {
		var t = i("<div style='position:relative;'></div>").appendTo(document.body),
			e = i("<div style='position:absolute;left:0;'></div>").appendTo(t)[0],
			n = pq.cVirtual,
			e = (e.style.top = 1e9 + "px", e.offsetTop - 50);
		16554378 < (r = e <= 1e4 ? r : e) && (r = 16554378), n.maxHt = r, t.remove(), n.setSBDim(), i(window).on("resize", n.setSBDim.bind(n))
	})
}(jQuery), ! function(I) {
	pq.cRender = function() {
		this.data = []
	}, pq.cRender.prototype = I.extend({}, {
		_m: function() {},
		autoHeight: function(t) {
			var e = this,
				n = e.that,
				i = e.isBody(),
				r = t.hChanged,
				o = e.freezeRows,
				a = !1,
				l = e.initV,
				s = e.finalV;
			e.rows && (i && n._trigger("beforeAutoRowHeight"), a = e.setRowHtArr(l, s, r), (a = e.setRowHtArr(0, o - 1, r) || a) ? (e.setTopArr(o ? 0 : l), e.assignTblDims(), e.setPanes(), e.setCellDims(!0), i && (t.source = "autoRow", e.refresh(t), n._trigger("autoRowHeight"))) : e.setCellDims(!0))
		},
		autoWidth: function(t) {
			function e(t) {
				0 <= r.indexOf(t) && n.setColWdArr(t, t)
			}
			var n = this,
				i = n.freezeCols,
				r = (t = t || {}).colIndx,
				o = n.initH,
				t = n.finalH,
				a = t;
			if (r) {
				for (; o <= a; a--) e(a);
				for (a = i - 1; 0 <= a; a--) e(a)
			} else n.setColWdArr(o, t), n.setColWdArr(0, i - 1)
		},
		_each: function(t, e, n, i, r, o) {
			for (var a, l = this.jump, s = 0; s <= n; s++)(a = i[s = l(e, o, s)])[r] || t.call(this, a, s)
		},
		eachV: function(t) {
			this._each(t, this.initV, this.finalV, this.data, "pq_hidden", this.freezeRows)
		},
		eachH: function(t) {
			this._each(t, this.initH, this.finalH, this.colModel, "hidden", this.freezeCols)
		},
		saveValues: function(t) {
			var r, o, a = [],
				l = this,
				s = "value" == t;
			return l.eachV(function(n, i) {
				a[i] = [], r = l.getHeightCell(i), l.eachH(function(t, e) {
					o = s ? n[t.dataIndx] : l.generateCell(i, e, n, t, l.getCellRegion(i, e), r, !0), a[i][e] = o
				})
			}), a
		},
		dirtyCells: function(r, t) {
			var o, a, l = [],
				s = this,
				d = "value" == t;
			return s.eachV(function(n, i) {
				o = s.getHeightCell(i), s.eachH(function(t, e) {
					a = d ? n[t.dataIndx] : s.generateCell(i, e, n, t, s.getCellRegion(i, e), o, !0), r[i] && r[i][e] !== a && l.push([i, e, n, t])
				})
			}), l
		},
		generateCell: function(t, e, n, i, r, o, a) {
			var l, s, d, c, u = this,
				h = u.iMerge,
				f = u.isHead(),
				p = [],
				g = u.riOffset,
				m = t + g,
				v = [u.cellCls];
			if (u._m() && (c = h.ismergedCell(m, e))) {
				if (!c.o_rc) return t == u._initV || e == u._initH ? (x = u.getCellRegion(t, e), l = (s = h.getRootCell(m, e)).v_ri - g, d = s.v_ci, l < 0 || (w = u.getCellRegion(l, d), u.mcLaid[l + "," + d + (w == x ? "" : "," + x)] = !0), "") : "";
				(s = h.getClsStyle(m, e)).style && p.push(s.style), s.cls && v.push(s.cls), m = c.o_ri, n = u.data[t = m - g], e = c.o_ci, i = u.colModel[e], o = u.getHeightCellM(t, c.o_rc), l = u.getWidthCellM(e, c.o_cc), v.push("pq-merge-cell")
			} else if (n.pq_hidden || i.hidden) return "";
			if (d = u.getCellId(t, e, r), !a && u.getById(d)) return "";
			var w = o || u.getHeightCell(t),
				x = l || u.colwdArr[e],
				h = u.getLeft(e);
			return p.push(u.rtl + ":" + h + "px;width:" + x + "px;height:" + w + "px;"), u.renderCell({
				style: p,
				cls: v,
				attr: ["role=" + (f ? "columnheader" : "gridcell") + " id='" + d + "'"],
				rowData: n,
				rowIndxPage: t,
				rowIndx: m,
				colIndx: e,
				dataIndx: i.dataIndx,
				column: i
			})
		},
		generateRow: function(t, e) {
			var n = "pq-grid-row",
				i = "top:" + this.getTop(t) + "px;height:" + this.getHeightR(t) + "px;width:100%;",
				e = "role=row id=" + this.getRowId(t, e) + " aria-rowindex=" + (t + 1),
				t = this.getRowClsStyleAttr(t);
			return "<div class='" + (n += " " + t[0]) + "' " + (e += " " + t[1]) + " style='" + i + "'>"
		},
		getById: function(t) {
			return document.getElementById(t)
		},
		getCell: function(t, e, n) {
			var i, r = this.riOffset,
				o = t + r;
			return n || (i = this.iMerge).ismergedCell(o, e) && (i = i.getRootCell(o, e), this.isHead() && (t = i.o_ri, e = i.o_ci), n = this.getCellRegion(i.v_ri - r, i.v_ci)), this.getById(this.getCellId(t, e, n))
		},
		getCellIndx: function(t) {
			t = t.id.split("-");
			if (t[3] == "u" + this.uuid) return "" == t[5] ? [+t[4], -1, t[7]] : [+t[4], +t[5], t[6]]
		},
		getCellId: function(t, e, n) {
			return t >= this.data.length ? "" : (n = n || this.getCellRegion(t, e), this.cellPrefix + t + "-" + e + "-" + n)
		},
		getCellCont: function(t, e) {
			return this["$c" + this.getCellRegion(t, e)]
		},
		getCellCoords: function(t, e) {
			var n = this.maxHt,
				i = this.riOffset,
				r = t + i,
				o = t,
				a = e,
				i = (this.isBody() && (o = (r = this.that.iMerge.inflateRange(r, e, r, e))[2] - i, a = r[3]), this.getTop(t)),
				r = this.getTop(o) + this.getHeightCell(o),
				t = this.getLeft(e),
				o = this.getLeft(a + 1);
			return n < r && (i -= r - n, r = n), n < o && (t -= o - n, o = n), [t, i, o, r]
		},
		getCellRegion: function(t, e) {
			var n = this.freezeCols;
			return t < this.freezeRows ? e < n ? "lt" : "tr" : e < n ? "left" : "right"
		},
		getCellXY: function(t, e) {
			var n = this.maxHt;
			return [Math.min(this.getLeft(e), n), Math.min(this.getTop(t), n)]
		},
		getContRight: function() {
			return this.$cright
		},
		getMergeCells: function() {
			return this._m() ? this.$tbl.children().children(".pq-merge-cell") : I()
		},
		getRow: function(t, e) {
			return this.getById(this.getRowId(t, e))
		},
		getAllCells: function() {
			return this.$ele.children().children().children().children().children(this.isHead() ? ".pq-grid-col" : ".pq-grid-cell")
		},
		get$Col: function(e, t) {
			var n = ["right", "left", "lt", "rt"].map(function(t) {
				return "[id$=-" + e + "-" + t + "]"
			}).join(",");
			return (t || this.getAllCells()).filter(n)
		},
		get$Row: function(t) {
			return this.$ele.find("[id^=" + this.getRowId(t, "") + "]")
		},
		getRowClsStyleAttr: function(t) {
			var e = this.that,
				n = this.rowStyle,
				i = [],
				r = e.options,
				o = r.rowInit,
				a = this.data[t],
				l = a.pq_rowcls,
				s = a.pq_rowattr,
				d = a.pq_rowstyle,
				c = pq.styleStr,
				u = "",
				h = [],
				f = t + this.riOffset;
			return r.stripeRows && this.stripeArr[t] && i.push("pq-striped"), a.pq_rowselect && i.push(e.iRows.hclass), l && i.push(l), s && (u += e.processAttr(s, h)), d && h.push(c(d)), o && (r = o.call(e, {
				rowData: a,
				rowIndxPage: t,
				rowIndx: f
			})) && ((l = r.cls) && i.push(l), (l = r.attr) && (u += " " + l), (l = r.style) && h.push(c(l))), h = h.join(""), n[t] = h, [i.join(" "), u]
		},
		getRowId: function(t, e) {
			if (null == e) throw "getRowId region.";
			return this.rowPrefix + t + "-" + e
		},
		getRowIndx: function(t) {
			t = t.id.split("-");
			return [+t[4], t[5]]
		},
		getTable: function(t, e) {
			return this["$tbl_" + this.getCellRegion(t, e)]
		},
		getTblCls: function(t) {
			var e = this.isBody() ? [] : ["pq-grid-summary-table"];
			return t.rowBorders && e.push("pq-td-border-top"), t.columnBorders && e.push("pq-td-border-right"), t.wrap || e.push("pq-no-wrap"), e.join(" ")
		},
		getFlexWidth: function() {
			return this._flexWidth
		},
		preInit: function(t) {
			var e = this,
				n = e.isBody(),
				i = e.isHead(),
				r = e.that,
				o = r.options,
				a = '<div class="pq-focus-mgr"><textarea></textarea></div>',
				l = r.eventNamespace,
				s = "pq-table " + e.getTblCls(o),
				d = ["pq-cont-inner ", "pq-cont-right", "pq-cont-left", "pq-cont-lt", "pq-cont-tr"];

			function c(t) {
				t.on("mousewheel DOMMouseScroll", e.onMouseWheel(e))
			}
			t.empty(), t[0].innerHTML = ['<div class="pq-grid-cont">', i || n ? a : "", n ? '<div class="pq-grid-norows">' + o.strNoRows + "</div>" : "", '<div class="', d[0] + d[1], '"><div class="pq-table-right ' + s + '"></div>', n ? "" : '<div class="pq-r-spacer" style="position:absolute;top:0;height:10px;"></div>', "</div>", '<div class="' + d[0] + d[2] + '"><div class="pq-table-left ' + s + '"></div></div>', '<div class="' + d[0] + d[4] + '"><div class="pq-table-tr ' + s + '"></div></div>', '<div class="' + d[0] + d[3] + '"><div class="pq-table-lt ' + s + '"></div></div>', i || n ? a : "", "</div>"].join(""), e.$cright = t.find("." + d[1]).on("scroll", e.onNativeScroll.bind(e)), e.virtualWin && I(window).on("scroll" + l + " resize" + l, e.onNativeScroll.bind(e)), n || (e.$spacer = t.find(".pq-r-spacer")), e.$cleft = t.find("." + d[2]).on("scroll", e.onScrollL.bind(e)), e.$clt = t.find("." + d[3]).on("scroll", e.onScrollLT), e.$ctr = t.find("." + d[4]).on("scroll", e.onScrollT), e.$tbl = t.find(".pq-table").on("scroll", e.onScrollLT), e.$tbl_right = t.find(".pq-table-right"), e.$tbl_left = t.find(".pq-table-left"), e.$tbl_lt = t.find(".pq-table-lt"), e.$tbl_tr = t.find(".pq-table-tr"), n ? (c(e.$cleft), c(e.$ctr), e.$norows = t.find(".pq-grid-norows"), r.$focusMgr = t.find(".pq-focus-mgr")) : i && (r.$focusMgrHead = t.find(".pq-focus-mgr"))
		},
		isBody: function() {},
		isHead: function() {},
		isSum: function() {},
		jump: function(t, e, n) {
			return n = n < t && e <= n ? t : n
		},
		hasMergeCls: function(t) {
			return t && 0 <= t.className.indexOf("pq-merge-cell")
		},
		initRefreshTimer: function(t) {
			t = this.onRefreshTimer(this, t);
			this.setTimer(t, "refresh")
		},
		initStripeArr: function() {
			for (var t, e = this.rows, n = 0, i = this.stripeArr = [], r = this.data; n < e; n++) r[n].pq_hidden || (t = i[n] = !t)
		},
		isRenderedRow: function(t) {
			return !!this.getRow(t)
		},
		onScrollLT: function() {
			this.scrollTop = this.scrollLeft = 0
		},
		onScrollT: function() {
			this.scrollTop = 0
		},
		onScrollL: function(t) {
			var e = t.target,
				n = this;
			pq.scrollLeft(e, 0), n.setTimer(function() {
				n.$cright[0].scrollTop = e.scrollTop
			}, "scrollL", 50)
		},
		refresh: function(t) {
			t = t || {};
			var e, n = this,
				i = n.that,
				r = n.isBody(),
				o = n.isHead(),
				a = (null != t.timer && t.timer, n.mcLaid = {}),
				l = n.freezeCols,
				s = n.numColWd,
				d = !(!l && !s),
				c = n.freezeRows,
				u = (y = n.calInitFinalSuper())[0],
				h = y[1],
				f = y[2],
				p = y[3],
				g = t.fullRefresh || y[4],
				m = n.initV,
				v = n.finalV,
				w = n.initH,
				x = n.finalH;
			for (e in g && r && i.blurEditor({
					force: !0
				}), n._initV = u, n._finalV = f, n._initH = h, n._finalH = p, r && i._trigger("beforeTableView", null, {
					initV: u,
					finalV: f,
					pageData: n.data
				}), g || (null != v && m <= f && u <= v && (m < u ? (n.removeView(m, u - 1, w, x), d && n.removeView(m, u - 1, s ? -1 : 0, l - 1)) : u < m && (n.renderView(u, m - 1, h, p), d && n.renderView(u, m - 1, 0, l - 1)), f < v ? (n.removeView(f + 1, v, w, x), d && n.removeView(f + 1, v, s ? -1 : 0, l - 1)) : v < f && (n.renderView(v + 1, f, h, p), d && n.renderView(v + 1, f, 0, l - 1)), m = u, v = f), null != x && w < p && h < x && (w < h ? (n.removeView(m, v, w, h - 1), c && n.removeView(0, c - 1, w, h - 1)) : h < w && (n.renderView(m, v, h, w - 1), c && n.renderView(0, c - 1, h, w - 1)), p < x ? (n.removeView(m, v, p + 1, x), c && n.removeView(0, c - 1, p + 1, x)) : x < p && (n.renderView(m, v, x + 1, p), c && n.renderView(0, c - 1, x + 1, p)), w = h, x = p)), g || f !== v || u !== m || h !== w || p !== x ? (r && i._trigger("beforeViewEmpty", null, {
					region: "right"
				}), n.$tbl_right.empty(), n.renderView(u, f, h, p), !d || f === v && u === m || (n.$tbl_left.empty(), n.renderView(u, f, 0, l - 1)), c && (h === w && p === x || (i._trigger("beforeViewEmpty", null, {
					region: "tr"
				}), n.$tbl_tr.empty(), n.renderView(0, c - 1, h, p)), d && null == v && (n.$tbl_lt.empty(), n.renderView(0, c - 1, 0, l - 1)))) : n.removeMergeCells(), a) {
				var y, C = +(y = e.split(","))[0],
					b = +y[1],
					I = y[2];
				n.renderView(C, C, b, b, I)
			}
			s = h != n.initH || p != n.finalH, m = s && null != n.initH;
			(g || f != n.finalV || u != n.initV || s) && (n.initV = u, n.finalV = f, n.initH = h, n.finalH = p, r ? i._trigger("refresh", null, {
				source: t.source,
				hChanged: m
			}) : i._trigger(o ? "refreshHeader" : "refreshSum", null, {
				hChanged: m
			}))
		},
		refreshAllCells: function(t) {
			this.initH = this.initV = this.finalH = this.finalV = null, (t = t || {}).fullRefresh = !0, this.refresh(t)
		},
		refreshCell: function(n, i, r, o) {
			function e(t, e) {
				t && (a = !0, t.id = "", I(t).replaceWith(l.generateCell(n, i, r, o, e)))
			}
			var a, l = this,
				t = l.isBody() && l._m() ? l.iMerge.getRootCellV(n + l.riOffset, i) : 0,
				s = n,
				d = i;
			return t ? (n = t.rowIndxPage, i = t.colIndx, r = t.rowData, o = t.column, ["lt", "tr", "left", "right"].forEach(function(t) {
				e(l.getCell(s, d, t), t)
			})) : e(l.getCell(n, i)), a
		},
		removeMergeCells: function() {
			for (var t, e, n, i, r, o, a, l = this, s = l.iMerge, d = l.riOffset, c = (l.freezeCols, l.freezeRows, l.getMergeCells()), u = l._initH, h = l._finalH, f = l._initV, p = l._finalV, g = 0, m = c.length; g < m; g++) r = c[g], (o = l.getCellIndx(r)) && (a = o[0], t = o[1], o = o[2], e = a + (n = s.getRootCell(a + d, t)).o_rc - 1, n = t + n.o_cc - 1, i = !1, p < a || h < t ? i = !0 : "right" == o ? (e < f || n < u) && (i = !0) : "left" == o ? e < f && (i = !0) : "tr" == o && n < u && (i = !0), a = r.parentNode, i && I(r).remove(), a.children.length || a.parentNode.removeChild(a))
		},
		removeView: function(t, e, n, i) {
			for (var r, o, a, l = this.getCellRegion(t, n), s = t; s <= e; s++)
				if (r = this.getRow(s, l)) {
					for (o = n; o <= i; o++) !(a = this.getCell(s, o, l)) || this.hasMergeCls(a) || I(a).remove();
					r.children.length || r.parentNode.removeChild(r)
				}
		},
		renderNumCell: function(t, e, n) {
			var i = this.getHeightR(t),
				r = this.isHead();
			return "<div id='" + this.getCellId(t, -1, n) + "' style='" + ("width:" + e + "px;height:" + i + "px;") + "' role='gridcell' class='pq-grid-number-cell '>" + (this.isBody() ? t + 1 + this.riOffset : r && t == this.data.length - 1 && this.numberCell.title || "") + "</div>"
		},
		renderRow: function(t, e, n, i, r, o) {
			var a, l, s, d = this.getRow(n, o),
				c = this.numColWd,
				u = [],
				h = this.getHeightCell(n),
				f = this.colModel;
			for (d || t.push(this.generateRow(n, o)), 0 != i || !c || "left" != o && "lt" != o || (s = this.renderNumCell(n, c, o), u.push(s)), l = i; l <= r; l++)(a = f[l]) && !a.hidden && (s = this.generateCell(n, l, e, a, o, h), u.push(s));
			c = u.join(""), d ? I(d).append(c) : t.push(c, "</div>")
		},
		renderView: function(t, e, n, i, r) {
			if (null != n && null != i) {
				r = r || this.getCellRegion(t, Math.min(n, i));
				for (var o, a = [], l = this.data, s = this["$tbl_" + r], d = t; d <= e; d++)(o = l[d]) && !o.pq_hidden && this.renderRow(a, o, d, n, i, r);
				s.append(a.join(""))
			}
		},
		scrollX: function(t, e) {
			var n = this.$cright[0];
			if (!(0 <= t)) return pq.scrollLeft(n);
			this.scrollXY(t, n.scrollTop, e)
		},
		setCellDims: function(s) {
			for (var d, c = this, u = c.rtl, h = c.iMerge, f = c._m(), p = c.colModel, g = c.numColWd, m = c.jump, v = c.setRowDims(), w = c.riOffset, x = c.initH, y = c.finalH, C = c.freezeCols, t = (c.eachV(function(t, e) {
					var n, i = c.get$Row(e),
						r = c.getHeightR(e),
						o = c.getTop(e),
						a = c.getHeightCell(e);
					v(i, r, o);
					for (var l = g ? -1 : 0; l <= y; l++) !((l = m(x, C, l)) < 0) && p[l].hidden || f && (b = h.ismergedCell(e + w, l)) || (n = c.getCell(e, l)) && ((d = n.style).height = (-1 == l ? r : a) + "px", s || (d.width = c.getWidthCell(l) + "px", d[u] = c.getLeft(l) + "px"))
				}), c.getMergeCells()), e = 0, n = t.length; e < n; e++) {
				var b, i, r, o, a, l = t[e],
					I = c.getCellIndx(l);
				I && (o = I[0], I = I[1], a = (b = h.getRootCell(o + w, I)).v_ri - w, i = c.get$Row(a), r = c.getHeightR(a), o = c.getHeightCellM(o, b.o_rc), a = c.getTop(a), v(i, r, a), (d = l.style).height = o + "px", s || (d.width = c.getWidthCellM(I, b.o_cc) + "px", d[u] = c.getLeft(I) + "px"))
			}
		},
		setRowDims: function() {
			return function(t, e, n) {
				e = {
					height: e,
					width: "100%"
				};
				e.top = n, t.css(e)
			}
		},
		setColWdArr: function(t, e) {
			var n, i, r, o, a, l, s, d, c = e,
				u = this,
				h = u.riOffset,
				f = u.jump,
				p = u.colModel,
				g = u.data,
				m = u.freezeRows,
				v = u.maxHt + "px",
				w = u.iMerge,
				x = u.initV,
				e = u.isBody(),
				y = u.isSum(),
				C = e || y,
				b = u.isHead() ? u.that.headerCells.length - 1 : u.finalV;
			if (0 <= b)
				for (; t <= c; c--)
					if (!(i = p[c]).hidden && -1 == (i.width + "").indexOf("%") && (o = C ? i.width : i._minWidth)) {
						for (n = 0; n <= b; n++)
							if ((a = g[n = f(x, m, n)]) && !a.pq_hidden) {
								if (a = !0, l = w.ismergedCell(n + h, c)) {
									if (1 == l) continue;
									if (1 < (l = w.getRootCell(n + h, c)).v_rc || 1 < l.v_cc) {
										if (1 < l.v_cc) continue;
										a = !1
									}
									r = u.getCell(l.o_ri - h, l.o_ci)
								} else r = u.getCell(n, c);
								r && (r.parentNode.style.width = v, a && (r.style.width = "auto", (s = I(r).find(".pq-icon-menu,.pq-icon-filter")).length && (s.css({
									position: "static",
									float: "left",
									width: 20
								}), (d = I(r).find(".pq-td-div")).css("width", "auto"))), l = r.offsetWidth + 1, a && s.length && (s.css({
									position: "",
									float: "",
									width: ""
								}), d.css("width", "")), o = Math.max(l, o))
							} if (!(0 < o)) throw "wd NaN";
						i.width = u.colwdArr[c] = o, i._resized = !0
					}
		},
		setRowHtArr: function(t, e, n) {
			for (var i, r, o, a, l, s, d, c, u, h = e, f = this, p = f.jump, g = f.riOffset, m = f.rowhtArr, v = f.data, w = f.colModel, x = f._m(), y = f.diffV, C = f.freezeCols, b = f.rowHt, I = f.iMerge, q = f.rowHtDetail, _ = f.initH, R = f.finalH; t <= h; h--)
				if ((o = v[h]) && !o.pq_hidden && !o.pq_htfix) {
					for (u = q ? f.getHtDetail(o, q) : 0, s = n ? m[h] - u : b, i = 0; i <= R; i++)
						if (!w[i = p(_, C, i)].hidden) {
							if (d = x && I.ismergedCell(h + g, i)) {
								if (1 == d || y) continue;
								d = I.getRootCell(h + g, i), a = f.getCell(d.o_ri - g, d.o_ci)
							} else a = f.getCell(h, i);
							a && (a.style.height = "auto", l = a.offsetHeight, d && (c = d.o_rc - (d.v_ri - d.o_ri) - 1, l -= 1 < d.v_rc ? f.getHeightCellDirty(d.v_ri - g + 1, c) : 0), s = Math.max(l, s))
						} m[h] != (u = s + u) && (m[h] = o.pq_ht = u, r = !0)
				} return r
		},
		setTimer: function(t) {
			var r = {};
			return !0 === t ? function(t) {
				t()
			} : function(t, e, n) {
				clearTimeout(r[e]);
				var i = this;
				r[e] = setTimeout(function() {
					i.that.element && t.call(i)
				}, n || 300)
			}
		}
	}, new pq.cVirtual)
}(jQuery), ! function(h) {
	pq.cRenderBody = function(t, e) {
		var n = this,
			i = n.uuid = t.uuid,
			r = t.options,
			o = n.$ele = e.$b,
			a = n.$sum = e.$sum,
			e = n.$h = e.$h,
			l = r.postRenderInterval;
		n.that = t, n.rowStyle = [], n.rtl = r.rtl ? "right" : "left", n.virtualWin = r.virtualWin, n.setTimer = n.setTimer(i), n.cellPrefix = "pq-body-cell-u" + i + "-", n.rowPrefix = "pq-body-row-u" + i + "-", n.cellCls = "pq-grid-cell", n.iMerge = t.iMerge, n.rowHt = r.rowHt || 27, n.rowHtDetail = "auto" == (i = r.detailModel.height) ? 1 : i, n.iRenderHead = t.iRenderHead = new pq.cRenderHead(t, e), n.iRenderSum = t.iRenderSum = new pq.cRenderSum(t, a), t.on("headHtChanged", n.onHeadHtChanged(n)), null != l && t.on("refresh refreshRow refreshCell refreshColumn", function() {
			l < 0 ? n.postRenderAll() : n.setTimer(n.postRenderAll, "postRender", l)
		}), n.preInit(o), t.on("refresh softRefresh", n.onRefresh.bind(n))
	}, pq.cRenderBody.prototype = h.extend({}, new h.paramquery.cGenerateView, new pq.cRender, {
		setHtCont: function(t) {
			this.dims.htCont = t, this.$ele.css("height", t)
		},
		flex: function(t) {
			var e = this.that;
			!1 !== e._trigger("beforeFlex", null, t) && (this.iRenderHead.autoWidth(t), this.iRenderSum.autoWidth(t), this.autoWidth(t), e.refreshCM(null, {
				flex: !0
			}), e.refresh({
				source: "flex",
				soft: !0
			}))
		},
		init: function(t) {
			var e, n = this,
				i = n.that,
				r = (t = t || {}).soft,
				o = !r,
				a = t.source,
				l = n.iRenderHead,
				s = n.iRenderSum,
				d = i.options,
				c = d.scrollModel,
				u = (n.freezeCols = d.freezeCols || 0, n.freezeRows = d.freezeRows, n.numberCell = d.numberCell),
				h = n.colModel = i.colModel;
			n.width = d.width, n.height = d.height;
			o && (n.dims = i.dims, n.autoFit = c.autoFit, n.pauseTO = c.timeout, e = (c = i.pdata || []).findIndex(function(t) {
				return !t.pq_hidden
			}), n.$norows.css("display", 0 <= e ? "none" : ""), n.data = c, n.maxHt = pq.cVirtual.maxHt, n.riOffset = i.riOffset, n.cols = h.length, n.rows = c.length, i._mergeCells && (n._m = function() {
				return !0
			}), n.autoRow = d.autoRow, n.initRowHtArrSuper(), d.stripeRows && n.initStripeArr()), n.refreshColumnWidths(), n.numColWd = l.numColWd = s.numColWd = u.show ? u.width : 0, n.initColWdArrSuper(), s.init(t), t.header ? l.init(t) : (n.setPanes(), l.setCellDims(), l.assignTblDims(!0)), s.initPost(t), t.header && l.initPost(t), n.$cright[0].scrollTop > n.getTop(n.rows) || (o ? n.refreshAllCells({
				source: a
			}) : r && (n.setCellDims(), n.refresh({
				source: a
			}), i._trigger("softRefresh")))
		},
		initColWdArr: function() {
			for (var t, e = this.colModel, n = e.length, i = (this.leftArr = this.iRenderHead.leftArr = this.iRenderSum.leftArr = [], 0), r = this.colwdArr = this.iRenderHead.colwdArr = this.iRenderSum.colwdArr = []; i < n; i++) t = e[i], r[i] = t.hidden ? 0 : t._width
		},
		initColWdArrSuper: function() {
			this.initColWdArr(), this.setTopArr(0, !0), this.assignTblDims(!0)
		},
		inViewport: function(t, e, n) {
			n = n || this.getCell(t, e);
			var i = this.dims,
				r = i.left - 2,
				o = i.right - (i.wdCont - i.wdContClient) + 2,
				a = i.top - 2,
				l = i.bottom - (i.htCont - i.htContClient) + 2,
				t = this.getCellRegion(t, e),
				e = n.parentNode,
				s = n.offsetLeft - i.wdContLeft,
				e = e.offsetTop - i.htContTop,
				i = s + n.offsetWidth,
				n = e + n.offsetHeight;
			return "right" == t ? r < s && i < o && a < e && n < l : "tr" == t ? r < s && i < o : "left" != t || a < e && n < l
		},
		isBody: function() {
			return !0
		},
		onHeadHtChanged: function(n) {
			return function(t, e) {
				n.setPanes()
			}
		},
		onMouseWheel: function(t) {
			var n;
			return function(t) {
				var e = this;
				e.style["pointer-events"] = "none", clearTimeout(n), n = setTimeout(function() {
					e.style["pointer-events"] = ""
				}, 300)
			}
		},
		onNativeScroll: function() {
			var t = this.$cright[0],
				e = this.that,
				n = t.scrollLeft,
				t = t.scrollTop;
			this.iRenderSum.setScrollLeft(n), this.iRenderHead.setScrollLeft(n), this.$cleft[0].scrollTop = t, this.$ctr[0].scrollLeft = n, this.refresh(), e._trigger("scroll"), this.setTimer(function() {
				e._trigger("scrollStop")
			}, "scrollStop", this.pauseTO)
		},
		onRefresh: function(t, e) {
			"autoRow" != e.source && this.initRefreshTimer(e.hChanged)
		},
		onRefreshTimer: function(e, n) {
			return function() {
				var t = e.$cright[0];
				e.autoRow && e.autoHeight({
					hChanged: n
				}), t.scrollTop = t.scrollTop, t.scrollLeft = t.scrollLeft
			}
		},
		pageDown: function(t, e) {
			var n, i = this,
				r = i.topArr,
				o = r[t],
				a = t,
				l = i.dims,
				s = this.$cright[0].scrollTop,
				l = 95 * Math.min(l.htContClient - l.htContTop, h(window).height()) / 100,
				d = o + l,
				c = t,
				u = r.length - 1;
			i.scrollY(s + l, function() {
				for (c = t < i.initV ? i.initV : t; c <= u; c++)
					if (n = r[c], o < n && (o = n, a = c - 1), d < n) {
						a = c - 1;
						break
					} e(a)
			})
		},
		pageUp: function(t, e) {
			for (var n, i = this.topArr, r = i[t], o = this.$cright[0].scrollTop, a = this.dims, a = 9 * Math.min(h(window).height(), a.htContClient - a.htContTop) / 10, l = r - a, s = t, d = t; 0 <= d; d--)
				if ((n = i[d]) < r && (r = n, s = d), n < l) {
					s = d;
					break
				} this.scrollY(o - a, function() {
				e(s)
			})
		},
		postRenderAll: function() {
			var i, r, o, a = this,
				l = a.that,
				s = a.riOffset,
				d = a.iMerge,
				c = a.data;
			a.colModel;
			a.eachH(function(t, n) {
				(o = t.postRender) && a.eachV(function(t, e) {
					r = d.getRootCellO(e + s, n, !0), (i = a.getCell(r.rowIndxPage, r.colIndx)) && !i._postRender && (r.cell = i, l.callFn(o, r), i._postRender = !0)
				})
			}), (o = a.numberCell.postRender) && a.eachV(function(t, e) {
				var n = a.getCell(e, -1),
					i = e + s,
					e = {
						rowIndxPage: e,
						colIndx: -1,
						rowIndx: i,
						rowData: c[i]
					};
				n && !n._postRender && (e.cell = n, l.callFn(o, e), n._postRender = !0)
			})
		},
		refreshRow: function(e) {
			var n, i, r = this,
				o = r.initH,
				a = r.finalH,
				l = r.freezeCols,
				t = r.get$Row(e),
				s = [];
			t.each(function(t, e) {
				e = r.getRowIndx(e);
				s.push(e[1])
			}), r.that._trigger("beforeViewEmpty", null, {
				rowIndxPage: e
			}), t.remove(), s.forEach(function(t) {
				i = "left" == t || "lt" == t ? (n = 0, l - 1) : (n = o, a), r.renderView(e, e, n, i, t)
			})
		},
		newScrollPos: function(t, e) {
			var n, i, r = this.dims,
				o = r[e ? "wdContClient" : "htContClient"],
				a = this.$cright[0],
				l = this[e ? "colModel" : "data"].length,
				s = this[e ? "freezeCols" : "freezeRows"],
				d = pq[e ? "scrollLeft" : "scrollTop"](a),
				r = r[e ? "wdContLeft" : "htContTop"];
			if (t < s || l - 1 < t) return d;
			s = this.getTopSafe(t, e), l = this[e ? "getWidthCell" : "getHeightR"](t);
			return null != s ? (!e && this.virtualWin && (e = (t = h(window)).scrollTop(), 0 <= (i = (a = s - d + h(a).offset().top - e) - t.height()) ? t.scrollTop(e + i + l) : a < 0 && t.scrollTop(e + a)), d + o < s + l + 1 ? s < (n = s + l + 1 - o) + r && (n = s - r) : s < d + r && (n = s - r), 0 <= (n = n < 0 ? 0 : n) ? n : d) : void 0
		},
		scrollColumn: function(t, e) {
			t = this.newScrollPos(t, !0);
			this.scrollX(t, e)
		},
		scrollRow: function(t, e) {
			t = this.newScrollPos(t);
			this.scrollY(t, e)
		},
		scrollCell: function(t, e, n) {
			t = this.newScrollPos(t), e = this.newScrollPos(e, !0);
			this.scrollXY(e, t, n)
		},
		scrollY: function(t, e) {
			var n = this.$cright[0];
			if (null == t) return n.scrollTop;
			t = 0 <= t ? t : 0, this.scrollXY(pq.scrollLeft(n), t, e)
		},
		scrollXY: function(t, e, n) {
			var i, r = this.$cright[0],
				o = this.that,
				a = r.scrollLeft,
				l = r.scrollTop;
			if (!(0 <= t)) return [a, l];
			pq.scrollLeft(r, t), r.scrollTop = e, i = r.scrollLeft, t = r.scrollTop, n && (i == a && t == l ? n() : o.one("scroll", function() {
				i == a ? n() : o.one("scrollHead", n)
			}))
		},
		getSBHt: function(t) {
			var e = this.dims,
				n = this.that.options,
				i = pq.cVirtual.SBDIM;
			return !this.autoFit && ("flex" != this.width || n.maxWidth) && t > e.wdCenter + i ? i : 0
		},
		getSBWd: function() {
			var t = this.dims,
				e = this.that.options.hideVScroll;
			return !t.htCenter || e && t.htCenter > (t.htTblHead || 0) + t.htTbl + t.htTblSum ? 0 : pq.cVirtual.SBDIM
		},
		setPanes: function() {
			var t = this,
				e = t.that.options,
				n = t.autoFit,
				i = t.dims,
				r = i.htCenter - i.htHead - i.htSum,
				o = i.wdCenter,
				a = t.$ele,
				l = t.freezeCols,
				s = t.freezeRows,
				d = t.$cright,
				c = d[0],
				u = t.$cleft,
				h = t.$clt,
				f = t.$ctr,
				l = t.getLeft(l),
				p = pq.cVirtual.SBDIM,
				g = i.wdTbl,
				m = Math.max(i.htTbl, 30) + t.getSBHt(g),
				v = t.getTopSafe(s);
			f.css("display", s ? "" : "none"), u.css("display", l ? "" : "none"), h.css("display", l && s ? "" : "none"), d.css("overflow-y", ""), "flex" == t.height ? (0 < r && r < m ? m = Math.min(m, r) : d.css("overflow-y", "hidden"), t.setHtCont(m)) : t.setHtCont(r), n && t.getSBWd() && d.css("overflow-y", "scroll"), d.css("overflow-x", n ? "hidden" : ""), "flex" == t.width ? (g = parseInt(a[0].style.height) >= i.htTbl - 1 ? g : g + p, e.maxWidth && o < g ? g = Math.min(g, o) : d.css("overflow-x", "hidden"), t._flexWidth = g, a.width(t._flexWidth)) : a.css("width", ""), t.htCont = i.htCont = d.height(), t.wdCont = i.wdCont = d.width(), i.htContClient = s = c.clientHeight, i.wdContClient = m = c.clientWidth, m < l && (d.css("overflow-x", "hidden"), l = m), u.css("width", l), h.css("width", l), f.width(m), u.height(s), r = c.offsetWidth, t.iRenderHead.setWidth(r, m), t.iRenderSum.setWidth(r, m), s < v && (d.css("overflow-y", "hidden"), v = s), h.css("height", v), f.css("height", v), t.wdContLeft = i.wdContLeft = u.width(), t.htContTop = i.htContTop = f.height()
		}
	}, new pq.cVirtual)
}(jQuery), ! function() {
	function t(t) {
		this.that = t
	}(jQuery.paramquery.cMergeHead = t).prototype = {
		getRootCell: function(t, e) {
			for (var n = this.that, i = n.headerCells, r = i[t][e], e = r.rowSpan, o = r.leftPos; t && i[t - 1][o] == r;) t--;
			return {
				v_ri: t,
				o_ri: t,
				v_ci: n.getNextVisibleCI(o),
				o_ci: o,
				v_rc: e,
				o_rc: e,
				v_cc: r.colSpan,
				o_cc: r.o_colspan
			}
		},
		ismergedCell: function(t, e) {
			var n, i = this.that,
				r = i.headerCells,
				o = r[t],
				o = o ? o[e] : "";
			if (o)
				if (n = o.leftPos, 0 != t && r[t - 1][e] === o || i.getNextVisibleCI(n) != e) {
					if (1 < o.colSpan || 1 < o.rowSpan) return !0
				} else if (r = o.rowSpan, i = o.colSpan, r && i && (1 < r || 1 < i)) return {
				o_ri: t,
				o_ci: n,
				v_rc: r,
				o_rc: r,
				v_cc: i,
				o_cc: o.o_colspan
			}
		},
		getClsStyle: function() {
			return {}
		}
	}
}(), ! function(t) {
	pq.cRenderHS = t.extend({}, new pq.cRender, {
		init: function(t) {
			var e, n = this,
				i = n.that,
				r = i.options,
				o = n.colModel = i.colModel,
				a = n.isHead(),
				l = n.isSum(),
				s = a ? r.autoRowHead : r.autoRowSum,
				d = i.headerCells,
				c = r.filterModel.header;
			n.freezeCols = r.freezeCols || 0, n.numberCell = r.numberCell, n.width = r.width, n.height = "flex", n.freezeRows = 0, n.dims = i.dims, a ? e = n.data = r.showHeader ? c ? d.concat([
				[]
			]) : d : c ? [
				[]
			] : [] : l && (e = n.data = r.summaryData || []), n.maxHt = pq.cVirtual.maxHt, n.riOffset = 0, n.cols = o.length, n.rows = e.length, a ? 1 < d.length && (n._m = function() {
				return !0
			}) : r.stripeRows && n.initStripeArr(), n.autoRow = null == s ? r.autoRow : s, n.initRowHtArrSuper(), n.assignTblDims(!0), n.setPanes()
		},
		initPost: function(t) {
			this.data.length && (t || {}).soft ? (this.setCellDims(), this.refresh()) : this.refreshAllCells()
		},
		onNativeScroll: function() {
			this.refresh(), this.isHead() && this.that._trigger("scrollHead")
		},
		onRefresh: function(t, e) {
			this.initRefreshTimer(e.hChanged)
		},
		refreshHS: function() {
			this.init(), this.initPost()
		},
		setPanes: function() {
			var t = this,
				e = t.that,
				n = t.dims,
				i = t.$ele,
				r = t.freezeCols,
				o = t.$cright,
				a = o[0],
				l = t.$cleft,
				r = t.getLeft(r),
				s = t.isHead(),
				d = t.isSum(),
				c = t.getTopSafe(t.rows);
			t.data.length;
			l.css("display", r ? "" : "none"), i.height(c), s ? (n.htHead = c, e._trigger("headHtChanged")) : d && (n.htSum = c, e._trigger("headHtChanged")), t.htCont = o.height(), t.wdCont = o.width(), l.css("width", r), l.height(a.clientHeight), t.wdContLeft = l.width(), t.htContTop = 0
		},
		setScrollLeft: function(t) {
			var e = this.$cright;
			e && this.scrollLeft !== t && (this.scrollLeft = e[0].scrollLeft = t)
		},
		setWidth: function(t, e) {
			this.$spacer.width(t - e)
		}
	})
}(jQuery), ! function(t) {
	var o = t.paramquery;
	(pq.cRenderHead = function(t, e) {
		var n = t.options,
			i = this,
			r = i.uuid = t.uuid;
		i.that = t, i.iMerge = new o.cMergeHead(t), i.$ele = e, i.height = "flex", i.scrollTop = 0, i.rtl = n.rtl ? "right" : "left", i.rowHt = n.rowHtHead || 28, i.cellCls = "pq-grid-col", i.setTimer = i.setTimer(!0), i.cellPrefix = "pq-head-cell-u" + r + "-", i.rowPrefix = "pq-head-row-u" + r + "-", i.preInit(e), (t.$head_i = e.children(".pq-grid-cont")).on("click", i.onHeaderClick.bind(i)), t.on("headerKeyDown", i.onHeaderKeyDown.bind(i)).on("refreshHeader softRefresh", i.onRefresh.bind(i))
	}).prototype = t.extend({}, pq.cRenderHS, o.mixHeader, o.mixHeaderFilter, {
		getRowClsStyleAttr: function(t) {
			var e = this.that.headerCells.length,
				n = "";
			return t == e - 1 ? n = "pq-grid-title-row" : e == t && (n = "pq-grid-header-search-row"), [n, "", ""]
		},
		getTblCls: function(t) {
			var e = "pq-grid-header-table";
			return t.hwrap ? e : e + " pq-no-wrap"
		},
		isHead: function() {
			return !0
		},
		onRefreshTimer: function(e, n) {
			return function() {
				var t = e.$cright[0];
				e.autoRow && e.autoHeight({
					timer: !1,
					hChanged: n
				}), t.scrollTop = 0, t.scrollLeft = t.scrollLeft, e.onCreateHeader(), e.refreshResizeColumn(), e.setSortIcons(), e.that._trigger("refreshHeadAsync")
			}
		},
		_resizeId: function(t) {
			return "pq-resize-div-" + this.uuid + "-" + t
		},
		_resizeCls: function() {
			return "pq-resize-div-" + this.uuid
		},
		_resizeDiv: function(t) {
			return this.getById(this._resizeId(t))
		},
		refreshResizeColumn: function() {
			var t, e, n, i = this.initH,
				r = this.colModel,
				o = this._resizeCls(),
				a = this.finalH,
				l = this.numberCell,
				s = this.freezeCols,
				d = [],
				c = [],
				u = l.show ? -1 : 0;
			for (this.$ele.find("." + o).remove(); u <= a; u++) {
				if (i <= u) t = c;
				else {
					if (!(u < s)) continue;
					t = d
				}(e = 0 <= u ? r[u] : l).hidden || !1 === e.resizable || this._resizeDiv(u) || (e = this.getLeft(u + 1) - 5, n = this._resizeId(u), t.push("<div id='", n, "' pq-col-indx='", u, "' style='", this.rtl, ":", e, "px;'", " class='pq-grid-col-resize-handle " + o + "'>&nbsp;</div>"))
			}
			d.length && this.$cleft.append(d.join("")), c.length && this.$cright.append(c.join(""))
		},
		renderCell: function(t) {
			var e = t.rowData,
				n = t.colIndx,
				i = t.attr,
				r = t.cls,
				o = t.style,
				e = e[n];
			return e ? (1 < e.colSpan && o.push("z-index:3;"), t.column = e, this.createHeaderCell(t)) : (e = this.renderFilterCell(t.column, n, r), "<div " + i + " class='" + r.join(" ") + "' style='" + o.join("") + "'>" + e + "</div>")
		}
	})
}(jQuery), ! function(t) {
	var e = t.paramquery;
	(pq.cRenderSum = function(t, e) {
		var n = t.options,
			i = this,
			r = i.uuid = t.uuid;
		i.that = t, i.rtl = n.rtl ? "right" : "left", i.rowStyle = [], i.iMerge = {
			ismergedCell: function() {}
		}, i.$ele = e, i.height = "flex", i.scrollTop = 0, i.rowHt = n.rowHtSum || 27, i.cellCls = "pq-grid-cell", i.setTimer = i.setTimer(!0), i.cellPrefix = "pq-sum-cell-u" + r + "-", i.rowPrefix = "pq-sum-row-u" + r + "-", i.preInit(e), t.on("refreshSum softRefresh", i.onRefresh.bind(i))
	}).prototype = t.extend({}, new e.cGenerateView, pq.cRenderHS, {
		isSum: function() {
			return !0
		},
		onRefreshTimer: function(e, n) {
			return function() {
				var t = e.$cright[0];
				e.autoRow && e.autoHeight({
					timer: !1,
					hChanged: n
				}), t.scrollTop = 0, t.scrollLeft = t.scrollLeft
			}
		}
	})
}(jQuery);