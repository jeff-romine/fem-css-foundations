(() => {
  var e = {
      3215: (e, t, r) => {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.resolveGlobalYarnPath = t.resolveGlobalNodePath = void 0);
        const s = r(2081),
          o = r(1017);
        function n() {
          return "win32" === process.platform;
        }
        (t.resolveGlobalNodePath = function (e) {
          let t = "npm";
          const r = { encoding: "utf8" };
          n() && ((t = "npm.cmd"), (r.shell = !0));
          const i = () => {};
          try {
            process.on("SIGPIPE", i);
            const a = (0, s.spawnSync)(
              t,
              ["config", "get", "prefix"],
              r,
            ).stdout;
            if (!a)
              return void (
                e && e("'npm config get prefix' didn't return a value.")
              );
            const l = a.trim();
            return (
              e && e(`'npm config get prefix' value is: ${l}`),
              l.length > 0
                ? n()
                  ? o.join(l, "node_modules")
                  : o.join(l, "lib", "node_modules")
                : void 0
            );
          } catch (e) {
            return;
          } finally {
            process.removeListener("SIGPIPE", i);
          }
        }),
          (t.resolveGlobalYarnPath = function (e) {
            let t = "yarn";
            const r = { encoding: "utf8" };
            n() && ((t = "yarn.cmd"), (r.shell = !0));
            const i = () => {};
            try {
              process.on("SIGPIPE", i);
              const n = (0, s.spawnSync)(t, ["global", "dir", "--json"], r),
                a = n.stdout;
              if (!a)
                return void (
                  e &&
                  (e("'yarn global dir' didn't return a value."),
                  n.stderr && e(n.stderr))
                );
              const l = a.trim().split(/\r?\n/);
              for (const e of l)
                try {
                  const t = JSON.parse(e);
                  if ("log" === t.type) return o.join(t.data, "node_modules");
                } catch (e) {}
              return;
            } catch (e) {
              return;
            } finally {
              process.removeListener("SIGPIPE", i);
            }
          });
      },
      9854: (e, t, r) => {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.LoggingService = void 0);
        const s = r(9496);
        t.LoggingService = class {
          constructor() {
            (this.outputChannel = s.window.createOutputChannel("Prettier")),
              (this.logLevel = "INFO");
          }
          setOutputLevel(e) {
            this.logLevel = e;
          }
          logDebug(e, t) {
            "NONE" !== this.logLevel &&
              "INFO" !== this.logLevel &&
              "WARN" !== this.logLevel &&
              "ERROR" !== this.logLevel &&
              (this.logMessage(e, "DEBUG"), t && this.logObject(t));
          }
          logInfo(e, t) {
            "NONE" !== this.logLevel &&
              "WARN" !== this.logLevel &&
              "ERROR" !== this.logLevel &&
              (this.logMessage(e, "INFO"), t && this.logObject(t));
          }
          logWarning(e, t) {
            "NONE" !== this.logLevel &&
              "ERROR" !== this.logLevel &&
              (this.logMessage(e, "WARN"), t && this.logObject(t));
          }
          logError(e, t) {
            "NONE" !== this.logLevel &&
              (this.logMessage(e, "ERROR"),
              "string" == typeof t
                ? this.outputChannel.appendLine(t)
                : t instanceof Error
                  ? (t?.message && this.logMessage(t.message, "ERROR"),
                    t?.stack && this.outputChannel.appendLine(t.stack))
                  : t && this.logObject(t));
          }
          show() {
            this.outputChannel.show();
          }
          logObject(e) {
            const t = JSON.stringify(e, null, 2);
            this.outputChannel.appendLine(t);
          }
          logMessage(e, t) {
            const r = new Date().toLocaleTimeString();
            this.outputChannel.appendLine(`["${t}" - ${r}] ${e}`);
          }
        };
      },
      3371: (e, t, r) => {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.resolveConfigPlugins =
            t.resolveNodeModule =
            t.loadNodeModule =
            t.nodeModuleLoader =
              void 0);
        const s = r(1017);
        function o() {
          return require;
        }
        function n(e, t) {
          try {
            return o().resolve(e, t);
          } catch (t) {
            throw new Error(`Error resolve node module '${e}'`);
          }
        }
        (t.nodeModuleLoader = o),
          (t.loadNodeModule = function (e) {
            try {
              return o()(e);
            } catch (t) {
              throw new Error(`Error loading node module '${e}'`);
            }
          }),
          (t.resolveNodeModule = n),
          (t.resolveConfigPlugins = function (e, t) {
            return (
              e?.plugins?.length &&
                (e.plugins = e.plugins.map((e) =>
                  "string" != typeof e || e.startsWith(".") || s.isAbsolute(e)
                    ? e
                    : n(e, { paths: [t] }) || e,
                )),
              e
            );
          });
      },
      604: (e, t, r) => {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.ModuleResolver = void 0);
        const s = r(2081),
          o = r(9536),
          n = r(7147),
          i = r(1017),
          a = r(3920),
          l = r(5559),
          c = r(9100),
          u = r(9496),
          h = r(3215),
          p = r(6906),
          d = r(9923),
          g = r(7136),
          f = r(5246),
          m = r(3371),
          v = n.statSync;
        n.statSync = (e, t) => {
          if (!0 === t?.throwIfNoEntry || void 0 === t?.throwIfNoEntry)
            return v(e, t);
          t.throwIfNoEntry = !0;
          try {
            return v(e, t);
          } catch (e) {
            if ("ENOENT" === e.code) return;
            throw e;
          }
        };
        const E = {
          npm: { cache: void 0, get: () => (0, h.resolveGlobalNodePath)() },
          pnpm: {
            cache: void 0,
            get: () => (0, s.execSync)("pnpm root -g").toString().trim(),
          },
          yarn: { cache: void 0, get: () => (0, h.resolveGlobalYarnPath)() },
        };
        t.ModuleResolver = class {
          constructor(e) {
            (this.loggingService = e),
              (this.ignorePathCache = new Map()),
              (this.path2Module = new Map()),
              (this.findPkgCache = new Map());
          }
          getGlobalPrettierInstance() {
            return a;
          }
          loadPrettierVersionFromPackageJson(e) {
            const t = o.sync(
              (e) => {
                const t = i.join(e, "package.json");
                if (n.existsSync(t)) return t;
              },
              { cwd: i.dirname(e) },
            );
            if (!t) throw new Error("Cannot find Prettier package.json");
            const r = (0, m.loadNodeModule)(t);
            let s = null;
            if (
              ("object" == typeof r &&
                null !== r &&
                "version" in r &&
                "string" == typeof r.version &&
                (s = r.version),
              !s)
            )
              throw new Error("Cannot load Prettier version from package.json");
            return s;
          }
          async getPrettierInstance(e) {
            if (!u.workspace.isTrusted)
              return (
                this.loggingService.logDebug(
                  p.UNTRUSTED_WORKSPACE_USING_BUNDLED_PRETTIER,
                ),
                a
              );
            const { prettierPath: t, resolveGlobalModules: r } = (0,
            d.getConfig)(u.Uri.file(e));
            let s, o;
            try {
              s = t
                ? (0, d.getWorkspaceRelativePath)(e, t)
                : this.findPkg(e, "prettier");
            } catch (e) {
              let t = "";
              if (!s && e instanceof Error) {
                const r = /Cannot find module '.*' from '(.*)'/.exec(e.message);
                r && r[1] && (t = r[1]);
              }
              return (
                this.loggingService.logInfo(
                  `Attempted to determine module path from ${s || t || "package.json"}`,
                ),
                void this.loggingService.logError(
                  p.FAILED_TO_LOAD_MODULE_MESSAGE,
                  e,
                )
              );
            }
            if (r && !s) {
              let t;
              if (u.workspace.workspaceFolders) {
                const r = u.workspace.getWorkspaceFolder(u.Uri.file(e));
                r && (t = r.uri);
              }
              const r = (function (e) {
                const t = E[e];
                if (t)
                  return void 0 === t.cache && (t.cache = t.get()), t.cache;
              })(await u.commands.executeCommand("npm.packageManager", t));
              if (r) {
                const e = i.join(r, "prettier");
                n.existsSync(e) && (s = e);
              }
            }
            if (void 0 !== s) {
              if (
                (this.loggingService.logDebug(
                  `Local prettier module path: '${s}'`,
                ),
                (o = this.path2Module.get(s)),
                o)
              )
                return o;
              try {
                const e = this.loadPrettierVersionFromPackageJson(s);
                (o = (0, d.isAboveV3)(e)
                  ? new g.PrettierWorkerInstance(s)
                  : new f.PrettierMainThreadInstance(s)),
                  o && this.path2Module.set(s, o);
              } catch (e) {
                return (
                  this.loggingService.logInfo(
                    `Attempted to load Prettier module from ${s || "package.json"}`,
                  ),
                  void this.loggingService.logError(
                    p.FAILED_TO_LOAD_MODULE_MESSAGE,
                    e,
                  )
                );
              }
            }
            if (o) {
              const e = await o.import();
              return !e && t
                ? void this.loggingService.logError(
                    p.INVALID_PRETTIER_PATH_MESSAGE,
                  )
                : e && c.gte(e, "1.13.0")
                  ? (this.loggingService.logDebug(
                      `Using prettier version ${e}`,
                    ),
                    o)
                  : (this.loggingService.logInfo(
                      `Attempted to load Prettier module from ${s}`,
                    ),
                    void this.loggingService.logError(
                      p.OUTDATED_PRETTIER_VERSION_MESSAGE,
                    ));
            }
            return this.loggingService.logDebug(p.USING_BUNDLED_PRETTIER), a;
          }
          async getResolvedIgnorePath(e, t) {
            const r = `${e}:${t}`;
            let s = this.ignorePathCache.get(r);
            if (
              !s &&
              ((s = (0, d.getWorkspaceRelativePath)(e, t)),
              u.workspace.workspaceFolders)
            ) {
              const r = u.workspace.workspaceFolders
                .map((e) => e.uri.fsPath)
                .filter((t) => {
                  const r = i.relative(t, e);
                  return r && !r.startsWith("..") && !i.isAbsolute(r);
                })
                .sort((e, t) => t.length - e.length);
              for (const e of r) {
                const r = i.join(e, t);
                if (
                  await n.promises.stat(r).then(
                    () => !0,
                    () => !1,
                  )
                ) {
                  s = r;
                  break;
                }
              }
            }
            return s && this.ignorePathCache.set(r, s), s;
          }
          async resolveConfig(e, t, r, s) {
            const o = "file" !== t.scheme && "vscode-userdata" !== t.scheme;
            let n;
            try {
              o || (n = (await e.resolveConfigFile(r)) ?? void 0);
            } catch (e) {
              return (
                this.loggingService.logError(
                  `Error resolving prettier configuration for ${r}`,
                  e,
                ),
                "error"
              );
            }
            const i = {
              config: o
                ? void 0
                : s.configPath
                  ? (0, d.getWorkspaceRelativePath)(r, s.configPath)
                  : n,
              editorconfig: o ? void 0 : s.useEditorConfig,
            };
            let a;
            try {
              a = o ? null : await e.resolveConfig(r, i);
            } catch (e) {
              return (
                this.loggingService.logError(
                  "Invalid prettier configuration file detected.",
                  e,
                ),
                this.loggingService.logError(p.INVALID_PRETTIER_CONFIG),
                "error"
              );
            }
            return (
              i.config &&
                this.loggingService.logInfo(
                  `Using config file at '${i.config}'`,
                ),
              a && (a = (0, m.resolveConfigPlugins)(a, r)),
              o || a || !s.requireConfig
                ? a
                : (this.loggingService.logInfo(
                    "Require config set to true and no config present. Skipping file.",
                  ),
                  "disabled")
            );
          }
          async getResolvedConfig({ fileName: e, uri: t }, r) {
            const s = (await this.getPrettierInstance(e)) || a;
            return await this.resolveConfig(s, t, e, r);
          }
          async dispose() {
            await a.clearConfigCache(),
              this.path2Module.forEach((e) => {
                try {
                  e.clearConfigCache();
                } catch (e) {
                  this.loggingService.logError(
                    "Error clearing module cache.",
                    e,
                  );
                }
              }),
              this.path2Module.clear();
          }
          isInternalTestRoot(e) {
            return !1;
          }
          findPkg(e, t) {
            const r = `${e}:${t}`,
              s = this.findPkgCache.get(r);
            if (s) return s;
            const a = e.split("/");
            let c = e;
            const u = a.indexOf("node_modules");
            u > 1 && (c = a.slice(0, u).join("/"));
            const h = o.sync(
              (e) => {
                if (n.existsSync(i.join(e, "package.json"))) {
                  let r;
                  try {
                    r = JSON.parse(
                      n.readFileSync(i.join(e, "package.json"), "utf8"),
                    );
                  } catch (e) {}
                  if (
                    r &&
                    ((r.dependencies && r.dependencies[t]) ||
                      (r.devDependencies && r.devDependencies[t]))
                  )
                    return e;
                }
                if (this.isInternalTestRoot(e)) return o.stop;
              },
              { cwd: c, type: "directory" },
            );
            if (h) {
              const e = l.sync(t, { basedir: h });
              return this.findPkgCache.set(r, e), e;
            }
            const p = o.sync(
              (e) =>
                n.existsSync(i.join(e, "node_modules", t))
                  ? e
                  : this.isInternalTestRoot(e)
                    ? o.stop
                    : void 0,
              { cwd: c, type: "directory" },
            );
            if (p) {
              const e = l.sync(t, { basedir: p });
              return this.findPkgCache.set(r, e), e;
            }
          }
        };
      },
      7732: (e, t) => {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.PrettierEditProvider = void 0),
          (t.PrettierEditProvider = class {
            constructor(e) {
              this.provideEdits = e;
            }
            async provideDocumentRangeFormattingEdits(e, t, r, s) {
              return this.provideEdits(e, {
                rangeEnd: e.offsetAt(t.end),
                rangeStart: e.offsetAt(t.start),
                force: !1,
              });
            }
            async provideDocumentFormattingEdits(e, t, r) {
              return this.provideEdits(e, { force: !1 });
            }
          });
      },
      1923: (e, t, r) => {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 });
        const s = r(9496),
          o = r(803),
          n = r(6906),
          i = r(7732),
          a = r(2331),
          l = r(9923),
          c = [
            ".prettierrc",
            ".prettierrc.json",
            ".prettierrc.json5",
            ".prettierrc.yaml",
            ".prettierrc.yml",
            ".prettierrc.toml",
            ".prettierrc.js",
            ".prettierrc.cjs",
            "package.json",
            "prettier.config.js",
            "prettier.config.cjs",
            ".editorconfig",
          ];
        t.default = class {
          constructor(e, t, r) {
            (this.moduleResolver = e),
              (this.loggingService = t),
              (this.statusBar = r),
              (this.registeredWorkspaces = new Set()),
              (this.allLanguages = []),
              (this.allExtensions = []),
              (this.allRangeLanguages = [
                "javascript",
                "javascriptreact",
                "typescript",
                "typescriptreact",
                "json",
                "jsonc",
                "graphql",
              ]),
              (this.forceFormatDocument = async () => {
                try {
                  const e = s.window.activeTextEditor;
                  if (!e)
                    return void this.loggingService.logInfo(
                      "No active document. Nothing was formatted.",
                    );
                  this.loggingService.logInfo(
                    "Forced formatting will not use ignore files.",
                  );
                  const t = await this.provideEdits(e.document, { force: !0 });
                  if (1 !== t.length) return;
                  await e.edit((e) => {
                    e.replace(t[0].range, t[0].newText);
                  });
                } catch (e) {
                  this.loggingService.logError("Error formatting document", e);
                }
              }),
              (this.prettierConfigChanged = async (e) =>
                this.resetFormatters(e)),
              (this.resetFormatters = (e) => {
                if (e) {
                  const t = s.workspace.getWorkspaceFolder(e);
                  this.registeredWorkspaces.delete(t?.uri.fsPath ?? "global");
                } else this.registeredWorkspaces.clear();
                this.statusBar.update(a.FormatterStatus.Ready);
              }),
              (this.handleActiveTextEditorChangedSync = (e) => {
                this.handleActiveTextEditorChanged(e).catch((e) => {
                  this.loggingService.logError(
                    "Error handling text editor change",
                    e,
                  );
                });
              }),
              (this.handleActiveTextEditorChanged = async (e) => {
                if (!e) return void this.statusBar.hide();
                const { document: t } = e;
                if ("file" !== t.uri.scheme)
                  return void this.statusBar.update(a.FormatterStatus.Ready);
                const r = s.workspace.getWorkspaceFolder(t.uri);
                if (!r) return;
                const o = await this.moduleResolver.getPrettierInstance(
                    r.uri.fsPath,
                  ),
                  n = this.registeredWorkspaces.has(r.uri.fsPath);
                if (!o)
                  return void this.statusBar.update(a.FormatterStatus.Error);
                const i = await this.getSelectors(o, r.uri);
                n ||
                  (this.registerDocumentFormatEditorProviders(i),
                  this.registeredWorkspaces.add(r.uri.fsPath),
                  this.loggingService.logDebug(
                    `Enabling Prettier for Workspace ${r.uri.fsPath}`,
                    i,
                  )),
                  s.languages.match(i.languageSelector, t) > 0
                    ? this.statusBar.update(a.FormatterStatus.Ready)
                    : this.statusBar.update(a.FormatterStatus.Disabled);
              }),
              (this.dispose = () => {
                this.moduleResolver.dispose(),
                  this.formatterHandler?.dispose(),
                  this.rangeFormatterHandler?.dispose(),
                  (this.formatterHandler = void 0),
                  (this.rangeFormatterHandler = void 0);
              }),
              (this.getSelectors = async (e, t) => {
                const r = [];
                if (t && "resolveConfig" in e && (0, l.isAboveV3)(e.version)) {
                  const s = await this.moduleResolver.resolveConfig(
                    e,
                    t,
                    t.fsPath,
                    (0, l.getConfig)(t),
                  );
                  "error" === s
                    ? this.statusBar.update(a.FormatterStatus.Error)
                    : "disabled" === s
                      ? this.statusBar.update(a.FormatterStatus.Disabled)
                      : s?.plugins && r.push(...s.plugins);
                }
                const { languages: s } = await e.getSupportInfo({ plugins: r });
                s.forEach((e) => {
                  e &&
                    e.vscodeLanguageIds &&
                    this.allLanguages.push(...e.vscodeLanguageIds);
                }),
                  (this.allLanguages = this.allLanguages.filter(
                    (e, t, r) => r.indexOf(e) === t,
                  )),
                  s.forEach((e) => {
                    e &&
                      e.extensions &&
                      this.allExtensions.push(...e.extensions);
                  }),
                  (this.allExtensions = this.allExtensions.filter(
                    (e, t, r) => r.indexOf(e) === t,
                  ));
                const { documentSelectors: o } = (0, l.getConfig)(),
                  n = t
                    ? 0 === this.allExtensions.length
                      ? []
                      : [
                          {
                            pattern: `${t.fsPath}/**/*.{${this.allExtensions.map((e) => e.substring(1)).join(",")}}`,
                            scheme: "file",
                          },
                        ]
                    : [];
                return {
                  languageSelector: [
                    ...(t
                      ? o.map((e) => ({
                          pattern: `${t.fsPath}/${e}`,
                          scheme: "file",
                        }))
                      : []),
                    ...n,
                    ...this.allLanguages.map((e) => ({ language: e })),
                    { language: "jsonc", scheme: "vscode-userdata" },
                  ],
                  rangeLanguageSelector: [
                    ...this.allRangeLanguages.map((e) => ({ language: e })),
                  ],
                };
              }),
              (this.provideEdits = async (e, t) => {
                const r = new Date().getTime(),
                  s = await this.format(e.getText(), e, t);
                if (!s) return [];
                const o = new Date().getTime() - r;
                return (
                  this.loggingService.logInfo(
                    `Formatting completed in ${o}ms.`,
                  ),
                  [this.minimalEdit(e, s)]
                );
              });
          }
          registerDisposables() {
            const e = s.workspace.createFileSystemWatcher("**/package.json");
            e.onDidChange(this.resetFormatters),
              e.onDidCreate(this.resetFormatters),
              e.onDidDelete(this.resetFormatters);
            const t = s.workspace.onDidChangeConfiguration((e) => {
                e.affectsConfiguration("prettier.enable")
                  ? this.loggingService.logWarning(n.RESTART_TO_ENABLE)
                  : e.affectsConfiguration("prettier") &&
                    this.resetFormatters();
              }),
              r = s.workspace.createFileSystemWatcher(`**/{${c.join(",")}}`);
            r.onDidChange(this.prettierConfigChanged),
              r.onDidCreate(this.prettierConfigChanged),
              r.onDidDelete(this.prettierConfigChanged);
            const o = s.window.onDidChangeActiveTextEditor(
              this.handleActiveTextEditorChangedSync,
            );
            return (
              this.handleActiveTextEditorChangedSync(s.window.activeTextEditor),
              [e, t, r, o]
            );
          }
          async registerGlobal() {
            const e = await this.getSelectors(
              this.moduleResolver.getGlobalPrettierInstance(),
            );
            this.registerDocumentFormatEditorProviders(e),
              this.loggingService.logDebug("Enabling Prettier globally", e);
          }
          registerDocumentFormatEditorProviders({
            languageSelector: e,
            rangeLanguageSelector: t,
          }) {
            this.dispose();
            const r = new i.PrettierEditProvider(this.provideEdits);
            (this.rangeFormatterHandler =
              s.languages.registerDocumentRangeFormattingEditProvider(t, r)),
              (this.formatterHandler =
                s.languages.registerDocumentFormattingEditProvider(e, r));
          }
          minimalEdit(e, t) {
            const r = e.getText();
            let o = 0;
            for (; o < r.length && o < t.length && r[o] === t[o]; ) ++o;
            let n = 0;
            for (
              ;
              o + n < r.length &&
              o + n < t.length &&
              r[r.length - n - 1] === t[t.length - n - 1];

            )
              ++n;
            const i = t.substring(o, t.length - n),
              a = e.positionAt(o),
              l = e.positionAt(r.length - n);
            return s.TextEdit.replace(new s.Range(a, l), i);
          }
          async format(e, t, r) {
            const { fileName: s, uri: n, languageId: i } = t;
            this.loggingService.logInfo(`Formatting ${n}`);
            const c = (0, l.getConfig)(n),
              u = await this.moduleResolver.getResolvedConfig(t, c);
            if ("error" === u)
              return void this.statusBar.update(a.FormatterStatus.Error);
            if ("disabled" === u)
              return void this.statusBar.update(a.FormatterStatus.Disabled);
            const h = await this.moduleResolver.getPrettierInstance(s);
            if ((this.loggingService.logInfo("PrettierInstance:", h), !h))
              return (
                this.loggingService.logError(
                  "Prettier could not be loaded. See previous logs for more information.",
                ),
                void this.statusBar.update(a.FormatterStatus.Error)
              );
            let p, d, g;
            if (
              (c.ignorePath &&
                ((p = await this.moduleResolver.getResolvedIgnorePath(
                  s,
                  c.ignorePath,
                )),
                p &&
                  this.loggingService.logInfo(
                    `Using ignore file (if present) at ${p}`,
                  )),
              s &&
                ((d = await h.getFileInfo(s, {
                  ignorePath: p,
                  plugins: u?.plugins?.filter((e) => "string" == typeof e),
                  resolveConfig: !0,
                  withNodeModules: c.withNodeModules,
                })),
                this.loggingService.logInfo("File Info:", d)),
              !r.force && d && d.ignored)
            )
              return (
                this.loggingService.logInfo("File is ignored, skipping."),
                void this.statusBar.update(a.FormatterStatus.Ignore)
              );
            if (d && d.inferredParser) g = d.inferredParser;
            else if ("plaintext" !== i) {
              this.loggingService.logWarning(
                "Parser not inferred, trying VS Code language.",
              );
              const { languages: e } = await h.getSupportInfo({ plugins: [] });
              g = (0, o.getParserFromLanguageId)(e, n, i);
            }
            if (!g)
              return (
                this.loggingService.logError(
                  "Failed to resolve a parser, skipping file. If you registered a custom file extension, be sure to configure the parser.",
                ),
                void this.statusBar.update(a.FormatterStatus.Error)
              );
            const f = this.getPrettierOptions(s, g, c, u, r);
            this.loggingService.logInfo("Prettier Options:", f);
            try {
              const t = await h.format(e, f);
              return this.statusBar.update(a.FormatterStatus.Success), t;
            } catch (t) {
              return (
                this.loggingService.logError("Error formatting document.", t),
                this.statusBar.update(a.FormatterStatus.Error),
                e
              );
            }
          }
          getPrettierOptions(e, t, r, s, o) {
            const n = null === s,
              i = {};
            let a;
            n &&
              ((i.arrowParens = r.arrowParens),
              (i.bracketSpacing = r.bracketSpacing),
              (i.endOfLine = r.endOfLine),
              (i.htmlWhitespaceSensitivity = r.htmlWhitespaceSensitivity),
              (i.insertPragma = r.insertPragma),
              (i.singleAttributePerLine = r.singleAttributePerLine),
              (i.bracketSameLine = r.bracketSameLine),
              (i.jsxBracketSameLine = r.jsxBracketSameLine),
              (i.jsxSingleQuote = r.jsxSingleQuote),
              (i.printWidth = r.printWidth),
              (i.proseWrap = r.proseWrap),
              (i.quoteProps = r.quoteProps),
              (i.requirePragma = r.requirePragma),
              (i.semi = r.semi),
              (i.singleQuote = r.singleQuote),
              (i.tabWidth = r.tabWidth),
              (i.trailingComma = r.trailingComma),
              (i.useTabs = r.useTabs),
              (i.embeddedLanguageFormatting = r.embeddedLanguageFormatting),
              (i.vueIndentScriptAndStyle = r.vueIndentScriptAndStyle)),
              this.loggingService.logInfo(
                n
                  ? "No local configuration (i.e. .prettierrc or .editorconfig) detected, falling back to VS Code configuration"
                  : "Detected local configuration (i.e. .prettierrc or .editorconfig), VS Code configuration will not be used",
              ),
              o.rangeEnd &&
                o.rangeStart &&
                (a = { rangeEnd: o.rangeEnd, rangeStart: o.rangeStart });
            const l = {
              ...(n ? i : {}),
              filepath: e,
              parser: t,
              ...(a || {}),
              ...(s || {}),
            };
            return (
              o.force && !0 === l.requirePragma && (l.requirePragma = !1), l
            );
          }
        };
      },
      5246: (e, t, r) => {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.PrettierMainThreadInstance = void 0);
        const s = r(3371);
        t.PrettierMainThreadInstance = class {
          constructor(e) {
            (this.modulePath = e), (this.version = null);
          }
          async import() {
            if (
              ((this.prettierModule = (0, s.loadNodeModule)(this.modulePath)),
              (this.version = this.prettierModule?.version ?? null),
              null == this.version)
            )
              throw new Error(
                `Failed to load Prettier instance: ${this.modulePath}`,
              );
            return this.version;
          }
          async format(e, t) {
            return (
              this.prettierModule || (await this.import()),
              this.prettierModule.format(e, t)
            );
          }
          async getFileInfo(e, t) {
            return (
              this.prettierModule || (await this.import()),
              this.prettierModule.getFileInfo(e, t)
            );
          }
          async getSupportInfo({ plugins: e }) {
            return (
              this.prettierModule || (await this.import()),
              this.prettierModule.getSupportInfo({ plugins: e })
            );
          }
          async clearConfigCache() {
            return (
              this.prettierModule || (await this.import()),
              this.prettierModule.clearConfigCache()
            );
          }
          async resolveConfigFile(e) {
            return (
              this.prettierModule || (await this.import()),
              this.prettierModule.resolveConfigFile(e)
            );
          }
          async resolveConfig(e, t) {
            return (
              this.prettierModule || (await this.import()),
              this.prettierModule.resolveConfig(e, t)
            );
          }
        };
      },
      7136: (e, t, r) => {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.PrettierWorkerInstance = void 0);
        const s = r(1267),
          o = r(5034),
          n = r(1017),
          i = new s.Worker(
            o.pathToFileURL(
              n.join(__dirname, "/worker/prettier-instance-worker.js"),
            ),
          );
        t.PrettierWorkerInstance = class {
          constructor(e) {
            (this.modulePath = e),
              (this.importResolver = null),
              (this.callMethodResolvers = new Map()),
              (this.currentCallMethodId = 0),
              (this.version = null),
              i.on("message", ({ type: e, payload: t }) => {
                switch (e) {
                  case "import":
                    this.importResolver?.resolve(t.version),
                      (this.version = t.version);
                    break;
                  case "callMethod": {
                    const e = this.callMethodResolvers.get(t.id);
                    this.callMethodResolvers.delete(t.id),
                      e &&
                        (t.isError ? e.reject(t.result) : e.resolve(t.result));
                    break;
                  }
                }
              });
          }
          async import() {
            const e = new Promise((e, t) => {
              this.importResolver = { resolve: e, reject: t };
            });
            return (
              i.postMessage({
                type: "import",
                payload: { modulePath: this.modulePath },
              }),
              e
            );
          }
          async format(e, t) {
            return await this.callMethod("format", [e, t]);
          }
          async getSupportInfo({ plugins: e }) {
            return await this.callMethod("getSupportInfo", [{ plugins: e }]);
          }
          async clearConfigCache() {
            await this.callMethod("clearConfigCache", []);
          }
          async getFileInfo(e, t) {
            return await this.callMethod("getFileInfo", [e, t]);
          }
          async resolveConfigFile(e) {
            return await this.callMethod("resolveConfigFile", [e]);
          }
          async resolveConfig(e, t) {
            return await this.callMethod("resolveConfig", [e, t]);
          }
          callMethod(e, t) {
            const r = this.currentCallMethodId++,
              s = new Promise((e, t) => {
                this.callMethodResolvers.set(r, { resolve: e, reject: t });
              });
            return (
              i.postMessage({
                type: "callMethod",
                payload: {
                  id: r,
                  modulePath: this.modulePath,
                  methodName: e,
                  methodArgs: t,
                },
              }),
              s
            );
          }
        };
      },
      2331: (e, t, r) => {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.StatusBar = t.FormatterStatus = void 0);
        const s = r(9496);
        var o;
        !(function (e) {
          (e.Ready = "check-all"),
            (e.Success = "check"),
            (e.Ignore = "x"),
            (e.Warn = "warning"),
            (e.Error = "alert"),
            (e.Disabled = "circle-slash");
        })((o = t.FormatterStatus || (t.FormatterStatus = {}))),
          (t.StatusBar = class {
            constructor() {
              (this.statusBarItem = s.window.createStatusBarItem(
                "prettier.status",
                s.StatusBarAlignment.Right,
                -1,
              )),
                (this.statusBarItem.name = "Prettier"),
                (this.statusBarItem.text = "Prettier"),
                (this.statusBarItem.command = "prettier.openOutput"),
                this.update(o.Ready),
                this.statusBarItem.show();
            }
            update(e) {
              switch (
                ((this.statusBarItem.text = `$(${e.toString()}) Prettier`), e)
              ) {
                case o.Ignore:
                case o.Warn:
                  this.statusBarItem.backgroundColor = new s.ThemeColor(
                    "statusBarItem.warningBackground",
                  );
                  break;
                case o.Error:
                  this.statusBarItem.backgroundColor = new s.ThemeColor(
                    "statusBarItem.errorBackground",
                  );
                  break;
                default:
                  this.statusBarItem.backgroundColor = new s.ThemeColor(
                    "statusBarItem.fourgroundBackground",
                  );
              }
              this.statusBarItem.show();
            }
            hide() {
              this.statusBarItem.hide();
            }
          });
      },
      3938: (e, t, r) => {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.TemplateService = void 0);
        const s = r(3837),
          o = r(9496);
        t.TemplateService = class {
          constructor(e, t) {
            (this.loggingService = e), (this.prettierModule = t);
          }
          async writeConfigFile(e) {
            const t = { tabWidth: 2, useTabs: !1 },
              r = o.Uri.joinPath(e, ".prettierrc"),
              n = {
                filepath: "file" === r.scheme ? r.fsPath : void 0,
                tabWidth: t.tabWidth,
                useTabs: t.useTabs,
              },
              i = await this.prettierModule.format(
                JSON.stringify(t, null, 2),
                n,
              );
            this.loggingService.logInfo(`Writing .prettierrc to '${r}'`),
              await o.workspace.fs.writeFile(r, new s.TextEncoder().encode(i));
          }
        };
      },
      5415: (e, t, r) => {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.createConfigFile = void 0);
        const s = r(9496);
        t.createConfigFile = (e) => async () => {
          const t = await s.window.showOpenDialog({
            canSelectFiles: !1,
            canSelectFolders: !0,
            canSelectMany: !1,
          });
          if (t && 1 === t.length) {
            const r = t[0];
            await e.writeConfigFile(r);
          }
        };
      },
      803: (e, t) => {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.getParserFromLanguageId = void 0),
          (t.getParserFromLanguageId = function (e, t, r) {
            if ("file" !== t.scheme && ["html", "json"].includes(r)) return r;
            const s = e.find(
              (e) =>
                e &&
                e.extensions &&
                Array.isArray(e.vscodeLanguageIds) &&
                e.vscodeLanguageIds.includes(r),
            );
            return s && s.parsers?.length > 0 ? s.parsers[0] : void 0;
          });
      },
      6906: (e, t) => {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.UNTRUSTED_WORKSPACE_USING_BUNDLED_PRETTIER =
            t.EXTENSION_DISABLED =
            t.USING_BUNDLED_PRETTIER =
            t.RESTART_TO_ENABLE =
            t.INVALID_PRETTIER_CONFIG =
            t.FAILED_TO_LOAD_MODULE_MESSAGE =
            t.INVALID_PRETTIER_PATH_MESSAGE =
            t.OUTDATED_PRETTIER_VERSION_MESSAGE =
              void 0),
          (t.OUTDATED_PRETTIER_VERSION_MESSAGE =
            "Your project is configured to use an outdated version of prettier that cannot be used by this extension. Upgrade to the latest version of prettier."),
          (t.INVALID_PRETTIER_PATH_MESSAGE =
            "`prettierPath` option does not reference a valid instance of Prettier. Please ensure you are passing a path to the prettier module, not the binary. Falling back to bundled version of prettier."),
          (t.FAILED_TO_LOAD_MODULE_MESSAGE =
            "Failed to load module. If you have prettier or plugins referenced in package.json, ensure you have run `npm install`"),
          (t.INVALID_PRETTIER_CONFIG =
            "Invalid prettier configuration file detected. See log for details."),
          (t.RESTART_TO_ENABLE =
            "To enable or disable prettier after changing the `enable` setting, you must restart VS Code."),
          (t.USING_BUNDLED_PRETTIER = "Using bundled version of prettier."),
          (t.EXTENSION_DISABLED =
            "Extension is disabled. No formatters will be registered. To enable, change the `prettier.enable` to `true` and restart VS Code."),
          (t.UNTRUSTED_WORKSPACE_USING_BUNDLED_PRETTIER =
            "This workspace is not trusted. Using the bundled version of prettier.");
      },
      9923: (e, t, r) => {
        "use strict";
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.isAboveV3 = t.getConfig = t.getWorkspaceRelativePath = void 0);
        const s = r(2037),
          o = r(1017),
          n = r(9100),
          i = r(9496);
        (t.getWorkspaceRelativePath = function (e, t) {
          if (
            "darwin" === process.platform &&
            0 === t.indexOf("~") &&
            s.homedir()
          )
            return t.replace(/^~(?=$|\/|\\)/, s.homedir());
          if (i.workspace.workspaceFolders) {
            const r = i.workspace.getWorkspaceFolder(i.Uri.file(e));
            return r ? (o.isAbsolute(t) ? t : o.join(r.uri.fsPath, t)) : void 0;
          }
        }),
          (t.getConfig = function (e) {
            const t = i.workspace.getConfiguration("prettier", e);
            return i.workspace.isTrusted
              ? t
              : {
                  ...t,
                  prettierPath: void 0,
                  configPath: void 0,
                  ignorePath: ".prettierignore",
                  documentSelectors: [],
                  useEditorConfig: !1,
                  withNodeModules: !1,
                  resolveGlobalModules: !1,
                };
          }),
          (t.isAboveV3 = function (e) {
            const t = n.parse(e);
            if (!t) throw new Error("Invalid version");
            return t.major >= 3;
          });
      },
      9536: (e, t, r) => {
        "use strict";
        const s = r(1017),
          o = r(7310),
          n = r(8185),
          i = Symbol("findUp.stop");
        (e.exports = async (e, t = {}) => {
          let r = s.resolve(t.cwd || "");
          const { root: n } = s.parse(r),
            a = [].concat(e),
            l = async (t) => {
              if ("function" != typeof e) return o(a, t);
              const r = await e(t.cwd);
              return "string" == typeof r ? o([r], t) : r;
            };
          for (;;) {
            const e = await l({ ...t, cwd: r });
            if (e === i) return;
            if (e) return s.resolve(r, e);
            if (r === n) return;
            r = s.dirname(r);
          }
        }),
          (e.exports.sync = (e, t = {}) => {
            let r = s.resolve(t.cwd || "");
            const { root: n } = s.parse(r),
              a = [].concat(e),
              l = (t) => {
                if ("function" != typeof e) return o.sync(a, t);
                const r = e(t.cwd);
                return "string" == typeof r ? o.sync([r], t) : r;
              };
            for (;;) {
              const e = l({ ...t, cwd: r });
              if (e === i) return;
              if (e) return s.resolve(r, e);
              if (r === n) return;
              r = s.dirname(r);
            }
          }),
          (e.exports.exists = n),
          (e.exports.sync.exists = n.sync),
          (e.exports.stop = i);
      },
      202: (e) => {
        "use strict";
        var t = "Function.prototype.bind called on incompatible ",
          r = Array.prototype.slice,
          s = Object.prototype.toString,
          o = "[object Function]";
        e.exports = function (e) {
          var n = this;
          if ("function" != typeof n || s.call(n) !== o)
            throw new TypeError(t + n);
          for (
            var i,
              a = r.call(arguments, 1),
              l = function () {
                if (this instanceof i) {
                  var t = n.apply(this, a.concat(r.call(arguments)));
                  return Object(t) === t ? t : this;
                }
                return n.apply(e, a.concat(r.call(arguments)));
              },
              c = Math.max(0, n.length - a.length),
              u = [],
              h = 0;
            h < c;
            h++
          )
            u.push("$" + h);
          if (
            ((i = Function(
              "binder",
              "return function (" +
                u.join(",") +
                "){ return binder.apply(this,arguments); }",
            )(l)),
            n.prototype)
          ) {
            var p = function () {};
            (p.prototype = n.prototype),
              (i.prototype = new p()),
              (p.prototype = null);
          }
          return i;
        };
      },
      8284: (e, t, r) => {
        "use strict";
        var s = r(202);
        e.exports = Function.prototype.bind || s;
      },
      6144: (e, t, r) => {
        "use strict";
        var s = r(8284);
        e.exports = s.call(Function.call, Object.prototype.hasOwnProperty);
      },
      2009: (e, t, r) => {
        "use strict";
        var s = r(6144);
        function o(e, t) {
          for (
            var r = e.split("."),
              s = t.split(" "),
              o = s.length > 1 ? s[0] : "=",
              n = (s.length > 1 ? s[1] : s[0]).split("."),
              i = 0;
            i < 3;
            ++i
          ) {
            var a = parseInt(r[i] || 0, 10),
              l = parseInt(n[i] || 0, 10);
            if (a !== l) return "<" === o ? a < l : ">=" === o && a >= l;
          }
          return ">=" === o;
        }
        function n(e, t) {
          var r = t.split(/ ?&& ?/);
          if (0 === r.length) return !1;
          for (var s = 0; s < r.length; ++s) if (!o(e, r[s])) return !1;
          return !0;
        }
        var i = r(9789);
        e.exports = function (e, t) {
          return (
            s(i, e) &&
            (function (e, t) {
              if ("boolean" == typeof t) return t;
              var r =
                void 0 === e ? process.versions && process.versions.node : e;
              if ("string" != typeof r)
                throw new TypeError(
                  void 0 === e
                    ? "Unable to determine current node version"
                    : "If provided, a valid node version is required",
                );
              if (t && "object" == typeof t) {
                for (var s = 0; s < t.length; ++s) if (n(r, t[s])) return !0;
                return !1;
              }
              return n(r, t);
            })(t, i[e])
          );
        };
      },
      7310: (e, t, r) => {
        "use strict";
        const s = r(1017),
          o = r(7147),
          { promisify: n } = r(3837),
          i = r(4092),
          a = n(o.stat),
          l = n(o.lstat),
          c = { directory: "isDirectory", file: "isFile" };
        function u({ type: e }) {
          if (!(e in c)) throw new Error(`Invalid type specified: ${e}`);
        }
        const h = (e, t) => void 0 === e || t[c[e]]();
        (e.exports = async (e, t) => {
          u(
            (t = { cwd: process.cwd(), type: "file", allowSymlinks: !0, ...t }),
          );
          const r = t.allowSymlinks ? a : l;
          return i(
            e,
            async (e) => {
              try {
                const o = await r(s.resolve(t.cwd, e));
                return h(t.type, o);
              } catch {
                return !1;
              }
            },
            t,
          );
        }),
          (e.exports.sync = (e, t) => {
            u(
              (t = {
                cwd: process.cwd(),
                allowSymlinks: !0,
                type: "file",
                ...t,
              }),
            );
            const r = t.allowSymlinks ? o.statSync : o.lstatSync;
            for (const o of e)
              try {
                const e = r(s.resolve(t.cwd, o));
                if (h(t.type, e)) return o;
              } catch {}
          });
      },
      3097: (e, t, r) => {
        "use strict";
        const s = r(4393),
          o = Symbol("max"),
          n = Symbol("length"),
          i = Symbol("lengthCalculator"),
          a = Symbol("allowStale"),
          l = Symbol("maxAge"),
          c = Symbol("dispose"),
          u = Symbol("noDisposeOnSet"),
          h = Symbol("lruList"),
          p = Symbol("cache"),
          d = Symbol("updateAgeOnGet"),
          g = () => 1,
          f = (e, t, r) => {
            const s = e[p].get(t);
            if (s) {
              const t = s.value;
              if (m(e, t)) {
                if ((E(e, s), !e[a])) return;
              } else
                r && (e[d] && (s.value.now = Date.now()), e[h].unshiftNode(s));
              return t.value;
            }
          },
          m = (e, t) => {
            if (!t || (!t.maxAge && !e[l])) return !1;
            const r = Date.now() - t.now;
            return t.maxAge ? r > t.maxAge : e[l] && r > e[l];
          },
          v = (e) => {
            if (e[n] > e[o])
              for (let t = e[h].tail; e[n] > e[o] && null !== t; ) {
                const r = t.prev;
                E(e, t), (t = r);
              }
          },
          E = (e, t) => {
            if (t) {
              const r = t.value;
              e[c] && e[c](r.key, r.value),
                (e[n] -= r.length),
                e[p].delete(r.key),
                e[h].removeNode(t);
            }
          };
        class y {
          constructor(e, t, r, s, o) {
            (this.key = e),
              (this.value = t),
              (this.length = r),
              (this.now = s),
              (this.maxAge = o || 0);
          }
        }
        const w = (e, t, r, s) => {
          let o = r.value;
          m(e, o) && (E(e, r), e[a] || (o = void 0)),
            o && t.call(s, o.value, o.key, e);
        };
        e.exports = class {
          constructor(e) {
            if (
              ("number" == typeof e && (e = { max: e }),
              e || (e = {}),
              e.max && ("number" != typeof e.max || e.max < 0))
            )
              throw new TypeError("max must be a non-negative number");
            this[o] = e.max || 1 / 0;
            const t = e.length || g;
            if (
              ((this[i] = "function" != typeof t ? g : t),
              (this[a] = e.stale || !1),
              e.maxAge && "number" != typeof e.maxAge)
            )
              throw new TypeError("maxAge must be a number");
            (this[l] = e.maxAge || 0),
              (this[c] = e.dispose),
              (this[u] = e.noDisposeOnSet || !1),
              (this[d] = e.updateAgeOnGet || !1),
              this.reset();
          }
          set max(e) {
            if ("number" != typeof e || e < 0)
              throw new TypeError("max must be a non-negative number");
            (this[o] = e || 1 / 0), v(this);
          }
          get max() {
            return this[o];
          }
          set allowStale(e) {
            this[a] = !!e;
          }
          get allowStale() {
            return this[a];
          }
          set maxAge(e) {
            if ("number" != typeof e)
              throw new TypeError("maxAge must be a non-negative number");
            (this[l] = e), v(this);
          }
          get maxAge() {
            return this[l];
          }
          set lengthCalculator(e) {
            "function" != typeof e && (e = g),
              e !== this[i] &&
                ((this[i] = e),
                (this[n] = 0),
                this[h].forEach((e) => {
                  (e.length = this[i](e.value, e.key)), (this[n] += e.length);
                })),
              v(this);
          }
          get lengthCalculator() {
            return this[i];
          }
          get length() {
            return this[n];
          }
          get itemCount() {
            return this[h].length;
          }
          rforEach(e, t) {
            t = t || this;
            for (let r = this[h].tail; null !== r; ) {
              const s = r.prev;
              w(this, e, r, t), (r = s);
            }
          }
          forEach(e, t) {
            t = t || this;
            for (let r = this[h].head; null !== r; ) {
              const s = r.next;
              w(this, e, r, t), (r = s);
            }
          }
          keys() {
            return this[h].toArray().map((e) => e.key);
          }
          values() {
            return this[h].toArray().map((e) => e.value);
          }
          reset() {
            this[c] &&
              this[h] &&
              this[h].length &&
              this[h].forEach((e) => this[c](e.key, e.value)),
              (this[p] = new Map()),
              (this[h] = new s()),
              (this[n] = 0);
          }
          dump() {
            return this[h]
              .map(
                (e) =>
                  !m(this, e) && {
                    k: e.key,
                    v: e.value,
                    e: e.now + (e.maxAge || 0),
                  },
              )
              .toArray()
              .filter((e) => e);
          }
          dumpLru() {
            return this[h];
          }
          set(e, t, r) {
            if ((r = r || this[l]) && "number" != typeof r)
              throw new TypeError("maxAge must be a number");
            const s = r ? Date.now() : 0,
              a = this[i](t, e);
            if (this[p].has(e)) {
              if (a > this[o]) return E(this, this[p].get(e)), !1;
              const i = this[p].get(e).value;
              return (
                this[c] && (this[u] || this[c](e, i.value)),
                (i.now = s),
                (i.maxAge = r),
                (i.value = t),
                (this[n] += a - i.length),
                (i.length = a),
                this.get(e),
                v(this),
                !0
              );
            }
            const d = new y(e, t, a, s, r);
            return d.length > this[o]
              ? (this[c] && this[c](e, t), !1)
              : ((this[n] += d.length),
                this[h].unshift(d),
                this[p].set(e, this[h].head),
                v(this),
                !0);
          }
          has(e) {
            if (!this[p].has(e)) return !1;
            const t = this[p].get(e).value;
            return !m(this, t);
          }
          get(e) {
            return f(this, e, !0);
          }
          peek(e) {
            return f(this, e, !1);
          }
          pop() {
            const e = this[h].tail;
            return e ? (E(this, e), e.value) : null;
          }
          del(e) {
            E(this, this[p].get(e));
          }
          load(e) {
            this.reset();
            const t = Date.now();
            for (let r = e.length - 1; r >= 0; r--) {
              const s = e[r],
                o = s.e || 0;
              if (0 === o) this.set(s.k, s.v);
              else {
                const e = o - t;
                e > 0 && this.set(s.k, s.v, e);
              }
            }
          }
          prune() {
            this[p].forEach((e, t) => f(this, t, !1));
          }
        };
      },
      9096: (e, t, r) => {
        "use strict";
        const s = r(9285);
        e.exports = (e) => {
          if ((!Number.isInteger(e) && e !== 1 / 0) || !(e > 0))
            throw new TypeError(
              "Expected `concurrency` to be a number from 1 and up",
            );
          const t = new s();
          let r = 0;
          const o = async (e, s, ...o) => {
              r++;
              const n = (async () => e(...o))();
              s(n);
              try {
                await n;
              } catch {}
              r--, t.size > 0 && t.dequeue()();
            },
            n = (s, ...n) =>
              new Promise((i) => {
                ((s, n, ...i) => {
                  t.enqueue(o.bind(null, s, n, ...i)),
                    (async () => {
                      await Promise.resolve(),
                        r < e && t.size > 0 && t.dequeue()();
                    })();
                })(s, i, ...n);
              });
          return (
            Object.defineProperties(n, {
              activeCount: { get: () => r },
              pendingCount: { get: () => t.size },
              clearQueue: {
                value: () => {
                  t.clear();
                },
              },
            }),
            n
          );
        };
      },
      4092: (e, t, r) => {
        "use strict";
        const s = r(9096);
        class o extends Error {
          constructor(e) {
            super(), (this.value = e);
          }
        }
        const n = async (e, t) => t(await e),
          i = async (e) => {
            const t = await Promise.all(e);
            if (!0 === t[1]) throw new o(t[0]);
            return !1;
          };
        e.exports = async (e, t, r) => {
          r = { concurrency: 1 / 0, preserveOrder: !0, ...r };
          const a = s(r.concurrency),
            l = [...e].map((e) => [e, a(n, e, t)]),
            c = s(r.preserveOrder ? 1 : 1 / 0);
          try {
            await Promise.all(l.map((e) => c(i, e)));
          } catch (e) {
            if (e instanceof o) return e.value;
            throw e;
          }
        };
      },
      8185: (e, t, r) => {
        "use strict";
        const s = r(7147),
          { promisify: o } = r(3837),
          n = o(s.access);
        (e.exports = async (e) => {
          try {
            return await n(e), !0;
          } catch (e) {
            return !1;
          }
        }),
          (e.exports.sync = (e) => {
            try {
              return s.accessSync(e), !0;
            } catch (e) {
              return !1;
            }
          });
      },
      8939: (e) => {
        "use strict";
        var t = "win32" === process.platform,
          r =
            /^(((?:[a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/]+[^\\\/]+)?[\\\/]?)(?:[^\\\/]*[\\\/])*)((\.{1,2}|[^\\\/]+?|)(\.[^.\/\\]*|))[\\\/]*$/,
          s = {
            parse: function (e) {
              if ("string" != typeof e)
                throw new TypeError(
                  "Parameter 'pathString' must be a string, not " + typeof e,
                );
              var t,
                s = ((t = e), r.exec(t).slice(1));
              if (!s || 5 !== s.length)
                throw new TypeError("Invalid path '" + e + "'");
              return {
                root: s[1],
                dir: s[0] === s[1] ? s[0] : s[0].slice(0, -1),
                base: s[2],
                ext: s[4],
                name: s[3],
              };
            },
          },
          o = /^((\/?)(?:[^\/]*\/)*)((\.{1,2}|[^\/]+?|)(\.[^.\/]*|))[\/]*$/,
          n = {
            parse: function (e) {
              if ("string" != typeof e)
                throw new TypeError(
                  "Parameter 'pathString' must be a string, not " + typeof e,
                );
              var t,
                r = ((t = e), o.exec(t).slice(1));
              if (!r || 5 !== r.length)
                throw new TypeError("Invalid path '" + e + "'");
              return {
                root: r[1],
                dir: r[0].slice(0, -1),
                base: r[2],
                ext: r[4],
                name: r[3],
              };
            },
          };
        (e.exports = t ? s.parse : n.parse),
          (e.exports.posix = n.parse),
          (e.exports.win32 = s.parse);
      },
      5559: (e, t, r) => {
        var s = r(2929);
        (s.core = r(9071)),
          (s.isCore = r(3373)),
          (s.sync = r(5314)),
          (e.exports = s);
      },
      2929: (e, t, r) => {
        var s = r(7147),
          o = r(38),
          n = r(1017),
          i = r(5994),
          a = r(4156),
          l = r(7038),
          c = r(2009),
          u =
            "win32" !== process.platform &&
            s.realpath &&
            "function" == typeof s.realpath.native
              ? s.realpath.native
              : s.realpath,
          h = o(),
          p = function (e, t) {
            s.stat(e, function (e, r) {
              return e
                ? "ENOENT" === e.code || "ENOTDIR" === e.code
                  ? t(null, !1)
                  : t(e)
                : t(null, r.isFile() || r.isFIFO());
            });
          },
          d = function (e, t) {
            s.stat(e, function (e, r) {
              return e
                ? "ENOENT" === e.code || "ENOTDIR" === e.code
                  ? t(null, !1)
                  : t(e)
                : t(null, r.isDirectory());
            });
          },
          g = function (e, t) {
            u(e, function (r, s) {
              r && "ENOENT" !== r.code ? t(r) : t(null, r ? e : s);
            });
          },
          f = function (e, t, r, s) {
            r && !1 === r.preserveSymlinks ? e(t, s) : s(null, t);
          },
          m = function (e, t, r) {
            e(t, function (e, t) {
              if (e) r(e);
              else
                try {
                  var s = JSON.parse(t);
                  r(null, s);
                } catch (e) {
                  r(null);
                }
            });
          };
        e.exports = function (e, t, r) {
          var o = r,
            u = t;
          if (
            ("function" == typeof t && ((o = u), (u = {})),
            "string" != typeof e)
          ) {
            var v = new TypeError("Path must be a string.");
            return process.nextTick(function () {
              o(v);
            });
          }
          var E = (u = l(e, u)).isFile || p,
            y = u.isDirectory || d,
            w = u.readFile || s.readFile,
            I = u.realpath || g,
            S = u.readPackage || m;
          if (u.readFile && u.readPackage) {
            var _ = new TypeError(
              "`readFile` and `readPackage` are mutually exclusive.",
            );
            return process.nextTick(function () {
              o(_);
            });
          }
          var R = u.packageIterator,
            N = u.extensions || [".js"],
            P = !1 !== u.includeCoreModules,
            T = u.basedir || n.dirname(i()),
            O = u.filename || T;
          u.paths = u.paths || [
            n.join(h, ".node_modules"),
            n.join(h, ".node_libraries"),
          ];
          var b,
            x = n.resolve(T);
          function $(t, r, s) {
            t
              ? o(t)
              : r
                ? o(null, r, s)
                : C(b, function (t, r, s) {
                    if (t) o(t);
                    else if (r)
                      f(I, r, u, function (e, t) {
                        e ? o(e) : o(null, t, s);
                      });
                    else {
                      var n = new Error(
                        "Cannot find module '" + e + "' from '" + O + "'",
                      );
                      (n.code = "MODULE_NOT_FOUND"), o(n);
                    }
                  });
          }
          function A(e, t, r) {
            var s = t,
              o = r;
            "function" == typeof s && ((o = s), (s = void 0)),
              (function e(t, r, s) {
                if (0 === t.length) return o(null, void 0, s);
                var i = r + t[0],
                  a = s;
                function l(s, l, h) {
                  if (((a = l), s)) return o(s);
                  if (h && a && u.pathFilter) {
                    var p = n.relative(h, i),
                      d = p.slice(0, p.length - t[0].length),
                      g = u.pathFilter(a, r, d);
                    if (g) return e([""].concat(N.slice()), n.resolve(h, g), a);
                  }
                  E(i, c);
                }
                function c(s, n) {
                  return s
                    ? o(s)
                    : n
                      ? o(null, i, a)
                      : void e(t.slice(1), r, a);
                }
                a ? l(null, a) : L(n.dirname(i), l);
              })([""].concat(N), e, s);
          }
          function L(e, t) {
            return "" === e ||
              "/" === e ||
              ("win32" === process.platform && /^\w:[/\\]*$/.test(e)) ||
              /[/\\]node_modules[/\\]*$/.test(e)
              ? t(null)
              : void f(I, e, u, function (r, s) {
                  if (r) return L(n.dirname(e), t);
                  var o = n.join(s, "package.json");
                  E(o, function (r, s) {
                    if (!s) return L(n.dirname(e), t);
                    S(w, o, function (r, s) {
                      r && t(r);
                      var n = s;
                      n && u.packageFilter && (n = u.packageFilter(n, o)),
                        t(null, n, e);
                    });
                  });
                });
          }
          function C(e, t, r) {
            var s = r,
              o = t;
            "function" == typeof o && ((s = o), (o = u.package)),
              f(I, e, u, function (t, r) {
                if (t) return s(t);
                var i = n.join(r, "package.json");
                E(i, function (t, r) {
                  return t
                    ? s(t)
                    : r
                      ? void S(w, i, function (t, r) {
                          if (t) return s(t);
                          var o = r;
                          if (
                            (o &&
                              u.packageFilter &&
                              (o = u.packageFilter(o, i)),
                            o && o.main)
                          ) {
                            if ("string" != typeof o.main) {
                              var a = new TypeError(
                                "package “" +
                                  o.name +
                                  "” `main` must be a string",
                              );
                              return (a.code = "INVALID_PACKAGE_MAIN"), s(a);
                            }
                            return (
                              ("." !== o.main && "./" !== o.main) ||
                                (o.main = "index"),
                              void A(
                                n.resolve(e, o.main),
                                o,
                                function (t, r, o) {
                                  return t
                                    ? s(t)
                                    : r
                                      ? s(null, r, o)
                                      : o
                                        ? void C(
                                            n.resolve(e, o.main),
                                            o,
                                            function (t, r, o) {
                                              return t
                                                ? s(t)
                                                : r
                                                  ? s(null, r, o)
                                                  : void A(
                                                      n.join(e, "index"),
                                                      o,
                                                      s,
                                                    );
                                            },
                                          )
                                        : A(n.join(e, "index"), o, s);
                                },
                              )
                            );
                          }
                          A(n.join(e, "/index"), o, s);
                        })
                      : A(n.join(e, "index"), o, s);
                });
              });
          }
          function F(e, t) {
            if (0 === t.length) return e(null, void 0);
            var r = t[0];
            function s(t, s, n) {
              return t ? e(t) : s ? e(null, s, n) : void C(r, u.package, o);
            }
            function o(r, s, o) {
              return r ? e(r) : s ? e(null, s, o) : void F(e, t.slice(1));
            }
            y(n.dirname(r), function (o, n) {
              return o ? e(o) : n ? void A(r, u.package, s) : F(e, t.slice(1));
            });
          }
          f(I, x, u, function (t, r) {
            t
              ? o(t)
              : (function (t) {
                  if (/^(?:\.\.?(?:\/|$)|\/|([A-Za-z]:)?[/\\])/.test(e))
                    (b = n.resolve(t, e)),
                      ("." !== e && ".." !== e && "/" !== e.slice(-1)) ||
                        (b += "/"),
                      /\/$/.test(e) && b === t
                        ? C(b, u.package, $)
                        : A(b, u.package, $);
                  else {
                    if (P && c(e)) return o(null, e);
                    !(function (e, t, r) {
                      var s = function () {
                        return (function (e, t, r) {
                          for (var s = a(t, r, e), o = 0; o < s.length; o++)
                            s[o] = n.join(s[o], e);
                          return s;
                        })(e, t, u);
                      };
                      F(r, R ? R(e, t, s, u) : s());
                    })(e, t, function (t, r, s) {
                      if (t) o(t);
                      else {
                        if (r)
                          return f(I, r, u, function (e, t) {
                            e ? o(e) : o(null, t, s);
                          });
                        var n = new Error(
                          "Cannot find module '" + e + "' from '" + O + "'",
                        );
                        (n.code = "MODULE_NOT_FOUND"), o(n);
                      }
                    });
                  }
                })(r);
          });
        };
      },
      5994: (e) => {
        e.exports = function () {
          var e = Error.prepareStackTrace;
          Error.prepareStackTrace = function (e, t) {
            return t;
          };
          var t = new Error().stack;
          return (Error.prepareStackTrace = e), t[2].getFileName();
        };
      },
      9071: (e, t, r) => {
        "use strict";
        var s = r(2009),
          o = r(2197),
          n = {};
        for (var i in o)
          Object.prototype.hasOwnProperty.call(o, i) && (n[i] = s(i));
        e.exports = n;
      },
      38: (e, t, r) => {
        "use strict";
        var s = r(2037);
        e.exports =
          s.homedir ||
          function () {
            var e = process.env.HOME,
              t =
                process.env.LOGNAME ||
                process.env.USER ||
                process.env.LNAME ||
                process.env.USERNAME;
            return "win32" === process.platform
              ? process.env.USERPROFILE ||
                  process.env.HOMEDRIVE + process.env.HOMEPATH ||
                  e ||
                  null
              : "darwin" === process.platform
                ? e || (t ? "/Users/" + t : null)
                : "linux" === process.platform
                  ? e ||
                    (0 === process.getuid() ? "/root" : t ? "/home/" + t : null)
                  : e || null;
          };
      },
      3373: (e, t, r) => {
        var s = r(2009);
        e.exports = function (e) {
          return s(e);
        };
      },
      4156: (e, t, r) => {
        var s = r(1017),
          o = s.parse || r(8939),
          n = function (e, t) {
            var r = "/";
            /^([A-Za-z]:)/.test(e) ? (r = "") : /^\\\\/.test(e) && (r = "\\\\");
            for (var n = [e], i = o(e); i.dir !== n[n.length - 1]; )
              n.push(i.dir), (i = o(i.dir));
            return n.reduce(function (e, o) {
              return e.concat(
                t.map(function (e) {
                  return s.resolve(r, o, e);
                }),
              );
            }, []);
          };
        e.exports = function (e, t, r) {
          var s =
            t && t.moduleDirectory
              ? [].concat(t.moduleDirectory)
              : ["node_modules"];
          if (t && "function" == typeof t.paths)
            return t.paths(
              r,
              e,
              function () {
                return n(e, s);
              },
              t,
            );
          var o = n(e, s);
          return t && t.paths ? o.concat(t.paths) : o;
        };
      },
      7038: (e) => {
        e.exports = function (e, t) {
          return t || {};
        };
      },
      5314: (e, t, r) => {
        var s = r(2009),
          o = r(7147),
          n = r(1017),
          i = r(38),
          a = r(5994),
          l = r(4156),
          c = r(7038),
          u =
            "win32" !== process.platform &&
            o.realpathSync &&
            "function" == typeof o.realpathSync.native
              ? o.realpathSync.native
              : o.realpathSync,
          h = i(),
          p = function (e) {
            try {
              var t = o.statSync(e, { throwIfNoEntry: !1 });
            } catch (e) {
              if (e && ("ENOENT" === e.code || "ENOTDIR" === e.code)) return !1;
              throw e;
            }
            return !!t && (t.isFile() || t.isFIFO());
          },
          d = function (e) {
            try {
              var t = o.statSync(e, { throwIfNoEntry: !1 });
            } catch (e) {
              if (e && ("ENOENT" === e.code || "ENOTDIR" === e.code)) return !1;
              throw e;
            }
            return !!t && t.isDirectory();
          },
          g = function (e) {
            try {
              return u(e);
            } catch (e) {
              if ("ENOENT" !== e.code) throw e;
            }
            return e;
          },
          f = function (e, t, r) {
            return r && !1 === r.preserveSymlinks ? e(t) : t;
          },
          m = function (e, t) {
            var r = e(t);
            try {
              return JSON.parse(r);
            } catch (e) {}
          };
        e.exports = function (e, t) {
          if ("string" != typeof e)
            throw new TypeError("Path must be a string.");
          var r = c(e, t),
            i = r.isFile || p,
            u = r.readFileSync || o.readFileSync,
            v = r.isDirectory || d,
            E = r.realpathSync || g,
            y = r.readPackageSync || m;
          if (r.readFileSync && r.readPackageSync)
            throw new TypeError(
              "`readFileSync` and `readPackageSync` are mutually exclusive.",
            );
          var w = r.packageIterator,
            I = r.extensions || [".js"],
            S = !1 !== r.includeCoreModules,
            _ = r.basedir || n.dirname(a()),
            R = r.filename || _;
          r.paths = r.paths || [
            n.join(h, ".node_modules"),
            n.join(h, ".node_libraries"),
          ];
          var N = f(E, n.resolve(_), r);
          if (/^(?:\.\.?(?:\/|$)|\/|([A-Za-z]:)?[/\\])/.test(e)) {
            var P = n.resolve(N, e);
            ("." !== e && ".." !== e && "/" !== e.slice(-1)) || (P += "/");
            var T = x(P) || A(P);
            if (T) return f(E, T, r);
          } else {
            if (S && s(e)) return e;
            var O = (function (e, t) {
              for (
                var s = function () {
                    return (function (e, t, r) {
                      for (var s = l(t, r, e), o = 0; o < s.length; o++)
                        s[o] = n.join(s[o], e);
                      return s;
                    })(e, t, r);
                  },
                  o = w ? w(e, t, s, r) : s(),
                  i = 0;
                i < o.length;
                i++
              ) {
                var a = o[i];
                if (v(n.dirname(a))) {
                  var c = x(a);
                  if (c) return c;
                  var u = A(a);
                  if (u) return u;
                }
              }
            })(e, N);
            if (O) return f(E, O, r);
          }
          var b = new Error("Cannot find module '" + e + "' from '" + R + "'");
          throw ((b.code = "MODULE_NOT_FOUND"), b);
          function x(e) {
            var t = $(n.dirname(e));
            if (t && t.dir && t.pkg && r.pathFilter) {
              var s = n.relative(t.dir, e),
                o = r.pathFilter(t.pkg, e, s);
              o && (e = n.resolve(t.dir, o));
            }
            if (i(e)) return e;
            for (var a = 0; a < I.length; a++) {
              var l = e + I[a];
              if (i(l)) return l;
            }
          }
          function $(e) {
            if (
              "" !== e &&
              "/" !== e &&
              !(
                ("win32" === process.platform && /^\w:[/\\]*$/.test(e)) ||
                /[/\\]node_modules[/\\]*$/.test(e)
              )
            ) {
              var t = n.join(f(E, e, r), "package.json");
              if (!i(t)) return $(n.dirname(e));
              var s = y(u, t);
              return (
                s && r.packageFilter && (s = r.packageFilter(s, e)),
                { pkg: s, dir: e }
              );
            }
          }
          function A(e) {
            var t = n.join(f(E, e, r), "/package.json");
            if (i(t)) {
              try {
                var s = y(u, t);
              } catch (e) {}
              if (
                (s && r.packageFilter && (s = r.packageFilter(s, e)),
                s && s.main)
              ) {
                if ("string" != typeof s.main) {
                  var o = new TypeError(
                    "package “" + s.name + "” `main` must be a string",
                  );
                  throw ((o.code = "INVALID_PACKAGE_MAIN"), o);
                }
                ("." !== s.main && "./" !== s.main) || (s.main = "index");
                try {
                  var a = x(n.resolve(e, s.main));
                  if (a) return a;
                  var l = A(n.resolve(e, s.main));
                  if (l) return l;
                } catch (e) {}
              }
            }
            return x(n.join(e, "/index"));
          }
        };
      },
      8721: (e, t, r) => {
        const s = Symbol("SemVer ANY");
        class o {
          static get ANY() {
            return s;
          }
          constructor(e, t) {
            if (((t = n(t)), e instanceof o)) {
              if (e.loose === !!t.loose) return e;
              e = e.value;
            }
            (e = e.trim().split(/\s+/).join(" ")),
              c("comparator", e, t),
              (this.options = t),
              (this.loose = !!t.loose),
              this.parse(e),
              this.semver === s
                ? (this.value = "")
                : (this.value = this.operator + this.semver.version),
              c("comp", this);
          }
          parse(e) {
            const t = this.options.loose
                ? i[a.COMPARATORLOOSE]
                : i[a.COMPARATOR],
              r = e.match(t);
            if (!r) throw new TypeError(`Invalid comparator: ${e}`);
            (this.operator = void 0 !== r[1] ? r[1] : ""),
              "=" === this.operator && (this.operator = ""),
              r[2]
                ? (this.semver = new u(r[2], this.options.loose))
                : (this.semver = s);
          }
          toString() {
            return this.value;
          }
          test(e) {
            if (
              (c("Comparator.test", e, this.options.loose),
              this.semver === s || e === s)
            )
              return !0;
            if ("string" == typeof e)
              try {
                e = new u(e, this.options);
              } catch (e) {
                return !1;
              }
            return l(e, this.operator, this.semver, this.options);
          }
          intersects(e, t) {
            if (!(e instanceof o))
              throw new TypeError("a Comparator is required");
            return "" === this.operator
              ? "" === this.value || new h(e.value, t).test(this.value)
              : "" === e.operator
                ? "" === e.value || new h(this.value, t).test(e.semver)
                : !(
                    ((t = n(t)).includePrerelease &&
                      ("<0.0.0-0" === this.value || "<0.0.0-0" === e.value)) ||
                    (!t.includePrerelease &&
                      (this.value.startsWith("<0.0.0") ||
                        e.value.startsWith("<0.0.0"))) ||
                    ((!this.operator.startsWith(">") ||
                      !e.operator.startsWith(">")) &&
                      (!this.operator.startsWith("<") ||
                        !e.operator.startsWith("<")) &&
                      (this.semver.version !== e.semver.version ||
                        !this.operator.includes("=") ||
                        !e.operator.includes("=")) &&
                      !(
                        l(this.semver, "<", e.semver, t) &&
                        this.operator.startsWith(">") &&
                        e.operator.startsWith("<")
                      ) &&
                      !(
                        l(this.semver, ">", e.semver, t) &&
                        this.operator.startsWith("<") &&
                        e.operator.startsWith(">")
                      ))
                  );
          }
        }
        e.exports = o;
        const n = r(4276),
          { safeRe: i, t: a } = r(4839),
          l = r(9801),
          c = r(7437),
          u = r(713),
          h = r(5589);
      },
      5589: (e, t, r) => {
        class s {
          constructor(e, t) {
            if (((t = n(t)), e instanceof s))
              return e.loose === !!t.loose &&
                e.includePrerelease === !!t.includePrerelease
                ? e
                : new s(e.raw, t);
            if (e instanceof i)
              return (
                (this.raw = e.value), (this.set = [[e]]), this.format(), this
              );
            if (
              ((this.options = t),
              (this.loose = !!t.loose),
              (this.includePrerelease = !!t.includePrerelease),
              (this.raw = e.trim().split(/\s+/).join(" ")),
              (this.set = this.raw
                .split("||")
                .map((e) => this.parseRange(e))
                .filter((e) => e.length)),
              !this.set.length)
            )
              throw new TypeError(`Invalid SemVer Range: ${this.raw}`);
            if (this.set.length > 1) {
              const e = this.set[0];
              if (
                ((this.set = this.set.filter((e) => !m(e[0]))),
                0 === this.set.length)
              )
                this.set = [e];
              else if (this.set.length > 1)
                for (const e of this.set)
                  if (1 === e.length && v(e[0])) {
                    this.set = [e];
                    break;
                  }
            }
            this.format();
          }
          format() {
            return (
              (this.range = this.set
                .map((e) => e.join(" ").trim())
                .join("||")
                .trim()),
              this.range
            );
          }
          toString() {
            return this.range;
          }
          parseRange(e) {
            const t =
                ((this.options.includePrerelease && g) |
                  (this.options.loose && f)) +
                ":" +
                e,
              r = o.get(t);
            if (r) return r;
            const s = this.options.loose,
              n = s ? c[u.HYPHENRANGELOOSE] : c[u.HYPHENRANGE];
            (e = e.replace(n, b(this.options.includePrerelease))),
              a("hyphen replace", e),
              (e = e.replace(c[u.COMPARATORTRIM], h)),
              a("comparator trim", e);
            let l = (e = (e = e.replace(c[u.TILDETRIM], p)).replace(
              c[u.CARETTRIM],
              d,
            ))
              .split(" ")
              .map((e) => y(e, this.options))
              .join(" ")
              .split(/\s+/)
              .map((e) => O(e, this.options));
            s &&
              (l = l.filter(
                (e) => (
                  a("loose invalid filter", e, this.options),
                  !!e.match(c[u.COMPARATORLOOSE])
                ),
              )),
              a("range list", l);
            const v = new Map(),
              E = l.map((e) => new i(e, this.options));
            for (const e of E) {
              if (m(e)) return [e];
              v.set(e.value, e);
            }
            v.size > 1 && v.has("") && v.delete("");
            const w = [...v.values()];
            return o.set(t, w), w;
          }
          intersects(e, t) {
            if (!(e instanceof s)) throw new TypeError("a Range is required");
            return this.set.some(
              (r) =>
                E(r, t) &&
                e.set.some(
                  (e) =>
                    E(e, t) &&
                    r.every((r) => e.every((e) => r.intersects(e, t))),
                ),
            );
          }
          test(e) {
            if (!e) return !1;
            if ("string" == typeof e)
              try {
                e = new l(e, this.options);
              } catch (e) {
                return !1;
              }
            for (let t = 0; t < this.set.length; t++)
              if (x(this.set[t], e, this.options)) return !0;
            return !1;
          }
        }
        e.exports = s;
        const o = new (r(3097))({ max: 1e3 }),
          n = r(4276),
          i = r(8721),
          a = r(7437),
          l = r(713),
          {
            safeRe: c,
            t: u,
            comparatorTrimReplace: h,
            tildeTrimReplace: p,
            caretTrimReplace: d,
          } = r(4839),
          { FLAG_INCLUDE_PRERELEASE: g, FLAG_LOOSE: f } = r(514),
          m = (e) => "<0.0.0-0" === e.value,
          v = (e) => "" === e.value,
          E = (e, t) => {
            let r = !0;
            const s = e.slice();
            let o = s.pop();
            for (; r && s.length; )
              (r = s.every((e) => o.intersects(e, t))), (o = s.pop());
            return r;
          },
          y = (e, t) => (
            a("comp", e, t),
            (e = _(e, t)),
            a("caret", e),
            (e = I(e, t)),
            a("tildes", e),
            (e = N(e, t)),
            a("xrange", e),
            (e = T(e, t)),
            a("stars", e),
            e
          ),
          w = (e) => !e || "x" === e.toLowerCase() || "*" === e,
          I = (e, t) =>
            e
              .trim()
              .split(/\s+/)
              .map((e) => S(e, t))
              .join(" "),
          S = (e, t) => {
            const r = t.loose ? c[u.TILDELOOSE] : c[u.TILDE];
            return e.replace(r, (t, r, s, o, n) => {
              let i;
              return (
                a("tilde", e, t, r, s, o, n),
                w(r)
                  ? (i = "")
                  : w(s)
                    ? (i = `>=${r}.0.0 <${+r + 1}.0.0-0`)
                    : w(o)
                      ? (i = `>=${r}.${s}.0 <${r}.${+s + 1}.0-0`)
                      : n
                        ? (a("replaceTilde pr", n),
                          (i = `>=${r}.${s}.${o}-${n} <${r}.${+s + 1}.0-0`))
                        : (i = `>=${r}.${s}.${o} <${r}.${+s + 1}.0-0`),
                a("tilde return", i),
                i
              );
            });
          },
          _ = (e, t) =>
            e
              .trim()
              .split(/\s+/)
              .map((e) => R(e, t))
              .join(" "),
          R = (e, t) => {
            a("caret", e, t);
            const r = t.loose ? c[u.CARETLOOSE] : c[u.CARET],
              s = t.includePrerelease ? "-0" : "";
            return e.replace(r, (t, r, o, n, i) => {
              let l;
              return (
                a("caret", e, t, r, o, n, i),
                w(r)
                  ? (l = "")
                  : w(o)
                    ? (l = `>=${r}.0.0${s} <${+r + 1}.0.0-0`)
                    : w(n)
                      ? (l =
                          "0" === r
                            ? `>=${r}.${o}.0${s} <${r}.${+o + 1}.0-0`
                            : `>=${r}.${o}.0${s} <${+r + 1}.0.0-0`)
                      : i
                        ? (a("replaceCaret pr", i),
                          (l =
                            "0" === r
                              ? "0" === o
                                ? `>=${r}.${o}.${n}-${i} <${r}.${o}.${+n + 1}-0`
                                : `>=${r}.${o}.${n}-${i} <${r}.${+o + 1}.0-0`
                              : `>=${r}.${o}.${n}-${i} <${+r + 1}.0.0-0`))
                        : (a("no pr"),
                          (l =
                            "0" === r
                              ? "0" === o
                                ? `>=${r}.${o}.${n}${s} <${r}.${o}.${+n + 1}-0`
                                : `>=${r}.${o}.${n}${s} <${r}.${+o + 1}.0-0`
                              : `>=${r}.${o}.${n} <${+r + 1}.0.0-0`)),
                a("caret return", l),
                l
              );
            });
          },
          N = (e, t) => (
            a("replaceXRanges", e, t),
            e
              .split(/\s+/)
              .map((e) => P(e, t))
              .join(" ")
          ),
          P = (e, t) => {
            e = e.trim();
            const r = t.loose ? c[u.XRANGELOOSE] : c[u.XRANGE];
            return e.replace(r, (r, s, o, n, i, l) => {
              a("xRange", e, r, s, o, n, i, l);
              const c = w(o),
                u = c || w(n),
                h = u || w(i),
                p = h;
              return (
                "=" === s && p && (s = ""),
                (l = t.includePrerelease ? "-0" : ""),
                c
                  ? (r = ">" === s || "<" === s ? "<0.0.0-0" : "*")
                  : s && p
                    ? (u && (n = 0),
                      (i = 0),
                      ">" === s
                        ? ((s = ">="),
                          u
                            ? ((o = +o + 1), (n = 0), (i = 0))
                            : ((n = +n + 1), (i = 0)))
                        : "<=" === s &&
                          ((s = "<"), u ? (o = +o + 1) : (n = +n + 1)),
                      "<" === s && (l = "-0"),
                      (r = `${s + o}.${n}.${i}${l}`))
                    : u
                      ? (r = `>=${o}.0.0${l} <${+o + 1}.0.0-0`)
                      : h && (r = `>=${o}.${n}.0${l} <${o}.${+n + 1}.0-0`),
                a("xRange return", r),
                r
              );
            });
          },
          T = (e, t) => (
            a("replaceStars", e, t), e.trim().replace(c[u.STAR], "")
          ),
          O = (e, t) => (
            a("replaceGTE0", e, t),
            e.trim().replace(c[t.includePrerelease ? u.GTE0PRE : u.GTE0], "")
          ),
          b = (e) => (t, r, s, o, n, i, a, l, c, u, h, p, d) =>
            `${(r = w(s) ? "" : w(o) ? `>=${s}.0.0${e ? "-0" : ""}` : w(n) ? `>=${s}.${o}.0${e ? "-0" : ""}` : i ? `>=${r}` : `>=${r}${e ? "-0" : ""}`)} ${(l = w(c) ? "" : w(u) ? `<${+c + 1}.0.0-0` : w(h) ? `<${c}.${+u + 1}.0-0` : p ? `<=${c}.${u}.${h}-${p}` : e ? `<${c}.${u}.${+h + 1}-0` : `<=${l}`)}`.trim(),
          x = (e, t, r) => {
            for (let r = 0; r < e.length; r++) if (!e[r].test(t)) return !1;
            if (t.prerelease.length && !r.includePrerelease) {
              for (let r = 0; r < e.length; r++)
                if (
                  (a(e[r].semver),
                  e[r].semver !== i.ANY && e[r].semver.prerelease.length > 0)
                ) {
                  const s = e[r].semver;
                  if (
                    s.major === t.major &&
                    s.minor === t.minor &&
                    s.patch === t.patch
                  )
                    return !0;
                }
              return !1;
            }
            return !0;
          };
      },
      713: (e, t, r) => {
        const s = r(7437),
          { MAX_LENGTH: o, MAX_SAFE_INTEGER: n } = r(514),
          { safeRe: i, t: a } = r(4839),
          l = r(4276),
          { compareIdentifiers: c } = r(921);
        class u {
          constructor(e, t) {
            if (((t = l(t)), e instanceof u)) {
              if (
                e.loose === !!t.loose &&
                e.includePrerelease === !!t.includePrerelease
              )
                return e;
              e = e.version;
            } else if ("string" != typeof e)
              throw new TypeError(
                `Invalid version. Must be a string. Got type "${typeof e}".`,
              );
            if (e.length > o)
              throw new TypeError(`version is longer than ${o} characters`);
            s("SemVer", e, t),
              (this.options = t),
              (this.loose = !!t.loose),
              (this.includePrerelease = !!t.includePrerelease);
            const r = e.trim().match(t.loose ? i[a.LOOSE] : i[a.FULL]);
            if (!r) throw new TypeError(`Invalid Version: ${e}`);
            if (
              ((this.raw = e),
              (this.major = +r[1]),
              (this.minor = +r[2]),
              (this.patch = +r[3]),
              this.major > n || this.major < 0)
            )
              throw new TypeError("Invalid major version");
            if (this.minor > n || this.minor < 0)
              throw new TypeError("Invalid minor version");
            if (this.patch > n || this.patch < 0)
              throw new TypeError("Invalid patch version");
            r[4]
              ? (this.prerelease = r[4].split(".").map((e) => {
                  if (/^[0-9]+$/.test(e)) {
                    const t = +e;
                    if (t >= 0 && t < n) return t;
                  }
                  return e;
                }))
              : (this.prerelease = []),
              (this.build = r[5] ? r[5].split(".") : []),
              this.format();
          }
          format() {
            return (
              (this.version = `${this.major}.${this.minor}.${this.patch}`),
              this.prerelease.length &&
                (this.version += `-${this.prerelease.join(".")}`),
              this.version
            );
          }
          toString() {
            return this.version;
          }
          compare(e) {
            if (
              (s("SemVer.compare", this.version, this.options, e),
              !(e instanceof u))
            ) {
              if ("string" == typeof e && e === this.version) return 0;
              e = new u(e, this.options);
            }
            return e.version === this.version
              ? 0
              : this.compareMain(e) || this.comparePre(e);
          }
          compareMain(e) {
            return (
              e instanceof u || (e = new u(e, this.options)),
              c(this.major, e.major) ||
                c(this.minor, e.minor) ||
                c(this.patch, e.patch)
            );
          }
          comparePre(e) {
            if (
              (e instanceof u || (e = new u(e, this.options)),
              this.prerelease.length && !e.prerelease.length)
            )
              return -1;
            if (!this.prerelease.length && e.prerelease.length) return 1;
            if (!this.prerelease.length && !e.prerelease.length) return 0;
            let t = 0;
            do {
              const r = this.prerelease[t],
                o = e.prerelease[t];
              if (
                (s("prerelease compare", t, r, o), void 0 === r && void 0 === o)
              )
                return 0;
              if (void 0 === o) return 1;
              if (void 0 === r) return -1;
              if (r !== o) return c(r, o);
            } while (++t);
          }
          compareBuild(e) {
            e instanceof u || (e = new u(e, this.options));
            let t = 0;
            do {
              const r = this.build[t],
                o = e.build[t];
              if (
                (s("prerelease compare", t, r, o), void 0 === r && void 0 === o)
              )
                return 0;
              if (void 0 === o) return 1;
              if (void 0 === r) return -1;
              if (r !== o) return c(r, o);
            } while (++t);
          }
          inc(e, t, r) {
            switch (e) {
              case "premajor":
                (this.prerelease.length = 0),
                  (this.patch = 0),
                  (this.minor = 0),
                  this.major++,
                  this.inc("pre", t, r);
                break;
              case "preminor":
                (this.prerelease.length = 0),
                  (this.patch = 0),
                  this.minor++,
                  this.inc("pre", t, r);
                break;
              case "prepatch":
                (this.prerelease.length = 0),
                  this.inc("patch", t, r),
                  this.inc("pre", t, r);
                break;
              case "prerelease":
                0 === this.prerelease.length && this.inc("patch", t, r),
                  this.inc("pre", t, r);
                break;
              case "major":
                (0 === this.minor &&
                  0 === this.patch &&
                  0 !== this.prerelease.length) ||
                  this.major++,
                  (this.minor = 0),
                  (this.patch = 0),
                  (this.prerelease = []);
                break;
              case "minor":
                (0 === this.patch && 0 !== this.prerelease.length) ||
                  this.minor++,
                  (this.patch = 0),
                  (this.prerelease = []);
                break;
              case "patch":
                0 === this.prerelease.length && this.patch++,
                  (this.prerelease = []);
                break;
              case "pre": {
                const e = Number(r) ? 1 : 0;
                if (!t && !1 === r)
                  throw new Error(
                    "invalid increment argument: identifier is empty",
                  );
                if (0 === this.prerelease.length) this.prerelease = [e];
                else {
                  let s = this.prerelease.length;
                  for (; --s >= 0; )
                    "number" == typeof this.prerelease[s] &&
                      (this.prerelease[s]++, (s = -2));
                  if (-1 === s) {
                    if (t === this.prerelease.join(".") && !1 === r)
                      throw new Error(
                        "invalid increment argument: identifier already exists",
                      );
                    this.prerelease.push(e);
                  }
                }
                if (t) {
                  let s = [t, e];
                  !1 === r && (s = [t]),
                    0 === c(this.prerelease[0], t)
                      ? isNaN(this.prerelease[1]) && (this.prerelease = s)
                      : (this.prerelease = s);
                }
                break;
              }
              default:
                throw new Error(`invalid increment argument: ${e}`);
            }
            return (
              (this.raw = this.format()),
              this.build.length && (this.raw += `+${this.build.join(".")}`),
              this
            );
          }
        }
        e.exports = u;
      },
      3372: (e, t, r) => {
        const s = r(3207);
        e.exports = (e, t) => {
          const r = s(e.trim().replace(/^[=v]+/, ""), t);
          return r ? r.version : null;
        };
      },
      9801: (e, t, r) => {
        const s = r(7977),
          o = r(9090),
          n = r(8590),
          i = r(177),
          a = r(69),
          l = r(7690);
        e.exports = (e, t, r, c) => {
          switch (t) {
            case "===":
              return (
                "object" == typeof e && (e = e.version),
                "object" == typeof r && (r = r.version),
                e === r
              );
            case "!==":
              return (
                "object" == typeof e && (e = e.version),
                "object" == typeof r && (r = r.version),
                e !== r
              );
            case "":
            case "=":
            case "==":
              return s(e, r, c);
            case "!=":
              return o(e, r, c);
            case ">":
              return n(e, r, c);
            case ">=":
              return i(e, r, c);
            case "<":
              return a(e, r, c);
            case "<=":
              return l(e, r, c);
            default:
              throw new TypeError(`Invalid operator: ${t}`);
          }
        };
      },
      4797: (e, t, r) => {
        const s = r(713),
          o = r(3207),
          { safeRe: n, t: i } = r(4839);
        e.exports = (e, t) => {
          if (e instanceof s) return e;
          if (("number" == typeof e && (e = String(e)), "string" != typeof e))
            return null;
          let r = null;
          if ((t = t || {}).rtl) {
            let t;
            for (
              ;
              (t = n[i.COERCERTL].exec(e)) &&
              (!r || r.index + r[0].length !== e.length);

            )
              (r && t.index + t[0].length === r.index + r[0].length) || (r = t),
                (n[i.COERCERTL].lastIndex =
                  t.index + t[1].length + t[2].length);
            n[i.COERCERTL].lastIndex = -1;
          } else r = e.match(n[i.COERCE]);
          return null === r
            ? null
            : o(`${r[2]}.${r[3] || "0"}.${r[4] || "0"}`, t);
        };
      },
      8354: (e, t, r) => {
        const s = r(713);
        e.exports = (e, t, r) => {
          const o = new s(e, r),
            n = new s(t, r);
          return o.compare(n) || o.compareBuild(n);
        };
      },
      8944: (e, t, r) => {
        const s = r(4077);
        e.exports = (e, t) => s(e, t, !0);
      },
      4077: (e, t, r) => {
        const s = r(713);
        e.exports = (e, t, r) => new s(e, r).compare(new s(t, r));
      },
      9700: (e, t, r) => {
        const s = r(3207);
        e.exports = (e, t) => {
          const r = s(e, null, !0),
            o = s(t, null, !0),
            n = r.compare(o);
          if (0 === n) return null;
          const i = n > 0,
            a = i ? r : o,
            l = i ? o : r,
            c = !!a.prerelease.length;
          if (l.prerelease.length && !c)
            return l.patch || l.minor
              ? a.patch
                ? "patch"
                : a.minor
                  ? "minor"
                  : "major"
              : "major";
          const u = c ? "pre" : "";
          return r.major !== o.major
            ? u + "major"
            : r.minor !== o.minor
              ? u + "minor"
              : r.patch !== o.patch
                ? u + "patch"
                : "prerelease";
        };
      },
      7977: (e, t, r) => {
        const s = r(4077);
        e.exports = (e, t, r) => 0 === s(e, t, r);
      },
      8590: (e, t, r) => {
        const s = r(4077);
        e.exports = (e, t, r) => s(e, t, r) > 0;
      },
      177: (e, t, r) => {
        const s = r(4077);
        e.exports = (e, t, r) => s(e, t, r) >= 0;
      },
      8907: (e, t, r) => {
        const s = r(713);
        e.exports = (e, t, r, o, n) => {
          "string" == typeof r && ((n = o), (o = r), (r = void 0));
          try {
            return new s(e instanceof s ? e.version : e, r).inc(t, o, n)
              .version;
          } catch (e) {
            return null;
          }
        };
      },
      69: (e, t, r) => {
        const s = r(4077);
        e.exports = (e, t, r) => s(e, t, r) < 0;
      },
      7690: (e, t, r) => {
        const s = r(4077);
        e.exports = (e, t, r) => s(e, t, r) <= 0;
      },
      7317: (e, t, r) => {
        const s = r(713);
        e.exports = (e, t) => new s(e, t).major;
      },
      2376: (e, t, r) => {
        const s = r(713);
        e.exports = (e, t) => new s(e, t).minor;
      },
      9090: (e, t, r) => {
        const s = r(4077);
        e.exports = (e, t, r) => 0 !== s(e, t, r);
      },
      3207: (e, t, r) => {
        const s = r(713);
        e.exports = (e, t, r = !1) => {
          if (e instanceof s) return e;
          try {
            return new s(e, t);
          } catch (e) {
            if (!r) return null;
            throw e;
          }
        };
      },
      7139: (e, t, r) => {
        const s = r(713);
        e.exports = (e, t) => new s(e, t).patch;
      },
      3642: (e, t, r) => {
        const s = r(3207);
        e.exports = (e, t) => {
          const r = s(e, t);
          return r && r.prerelease.length ? r.prerelease : null;
        };
      },
      7800: (e, t, r) => {
        const s = r(4077);
        e.exports = (e, t, r) => s(t, e, r);
      },
      3131: (e, t, r) => {
        const s = r(8354);
        e.exports = (e, t) => e.sort((e, r) => s(r, e, t));
      },
      3396: (e, t, r) => {
        const s = r(5589);
        e.exports = (e, t, r) => {
          try {
            t = new s(t, r);
          } catch (e) {
            return !1;
          }
          return t.test(e);
        };
      },
      9785: (e, t, r) => {
        const s = r(8354);
        e.exports = (e, t) => e.sort((e, r) => s(e, r, t));
      },
      9390: (e, t, r) => {
        const s = r(3207);
        e.exports = (e, t) => {
          const r = s(e, t);
          return r ? r.version : null;
        };
      },
      9100: (e, t, r) => {
        const s = r(4839),
          o = r(514),
          n = r(713),
          i = r(921),
          a = r(3207),
          l = r(9390),
          c = r(3372),
          u = r(8907),
          h = r(9700),
          p = r(7317),
          d = r(2376),
          g = r(7139),
          f = r(3642),
          m = r(4077),
          v = r(7800),
          E = r(8944),
          y = r(8354),
          w = r(9785),
          I = r(3131),
          S = r(8590),
          _ = r(69),
          R = r(7977),
          N = r(9090),
          P = r(177),
          T = r(7690),
          O = r(9801),
          b = r(4797),
          x = r(8721),
          $ = r(5589),
          A = r(3396),
          L = r(5471),
          C = r(3234),
          F = r(856),
          k = r(7787),
          D = r(409),
          M = r(5256),
          j = r(688),
          G = r(577),
          U = r(909),
          B = r(9009),
          W = r(8376);
        e.exports = {
          parse: a,
          valid: l,
          clean: c,
          inc: u,
          diff: h,
          major: p,
          minor: d,
          patch: g,
          prerelease: f,
          compare: m,
          rcompare: v,
          compareLoose: E,
          compareBuild: y,
          sort: w,
          rsort: I,
          gt: S,
          lt: _,
          eq: R,
          neq: N,
          gte: P,
          lte: T,
          cmp: O,
          coerce: b,
          Comparator: x,
          Range: $,
          satisfies: A,
          toComparators: L,
          maxSatisfying: C,
          minSatisfying: F,
          minVersion: k,
          validRange: D,
          outside: M,
          gtr: j,
          ltr: G,
          intersects: U,
          simplifyRange: B,
          subset: W,
          SemVer: n,
          re: s.re,
          src: s.src,
          tokens: s.t,
          SEMVER_SPEC_VERSION: o.SEMVER_SPEC_VERSION,
          RELEASE_TYPES: o.RELEASE_TYPES,
          compareIdentifiers: i.compareIdentifiers,
          rcompareIdentifiers: i.rcompareIdentifiers,
        };
      },
      514: (e) => {
        const t = Number.MAX_SAFE_INTEGER || 9007199254740991;
        e.exports = {
          MAX_LENGTH: 256,
          MAX_SAFE_COMPONENT_LENGTH: 16,
          MAX_SAFE_INTEGER: t,
          RELEASE_TYPES: [
            "major",
            "premajor",
            "minor",
            "preminor",
            "patch",
            "prepatch",
            "prerelease",
          ],
          SEMVER_SPEC_VERSION: "2.0.0",
          FLAG_INCLUDE_PRERELEASE: 1,
          FLAG_LOOSE: 2,
        };
      },
      7437: (e) => {
        const t =
          "object" == typeof process &&
          process.env &&
          process.env.NODE_DEBUG &&
          /\bsemver\b/i.test(process.env.NODE_DEBUG)
            ? (...e) => console.error("SEMVER", ...e)
            : () => {};
        e.exports = t;
      },
      921: (e) => {
        const t = /^[0-9]+$/,
          r = (e, r) => {
            const s = t.test(e),
              o = t.test(r);
            return (
              s && o && ((e = +e), (r = +r)),
              e === r ? 0 : s && !o ? -1 : o && !s ? 1 : e < r ? -1 : 1
            );
          };
        e.exports = {
          compareIdentifiers: r,
          rcompareIdentifiers: (e, t) => r(t, e),
        };
      },
      4276: (e) => {
        const t = Object.freeze({ loose: !0 }),
          r = Object.freeze({});
        e.exports = (e) => (e ? ("object" != typeof e ? t : e) : r);
      },
      4839: (e, t, r) => {
        const { MAX_SAFE_COMPONENT_LENGTH: s } = r(514),
          o = r(7437),
          n = ((t = e.exports = {}).re = []),
          i = (t.safeRe = []),
          a = (t.src = []),
          l = (t.t = {});
        let c = 0;
        const u = (e, t, r) => {
          const s = t.split("\\s*").join("\\s{0,1}").split("\\s+").join("\\s"),
            u = c++;
          o(e, u, t),
            (l[e] = u),
            (a[u] = t),
            (n[u] = new RegExp(t, r ? "g" : void 0)),
            (i[u] = new RegExp(s, r ? "g" : void 0));
        };
        u("NUMERICIDENTIFIER", "0|[1-9]\\d*"),
          u("NUMERICIDENTIFIERLOOSE", "[0-9]+"),
          u("NONNUMERICIDENTIFIER", "\\d*[a-zA-Z-][a-zA-Z0-9-]*"),
          u(
            "MAINVERSION",
            `(${a[l.NUMERICIDENTIFIER]})\\.(${a[l.NUMERICIDENTIFIER]})\\.(${a[l.NUMERICIDENTIFIER]})`,
          ),
          u(
            "MAINVERSIONLOOSE",
            `(${a[l.NUMERICIDENTIFIERLOOSE]})\\.(${a[l.NUMERICIDENTIFIERLOOSE]})\\.(${a[l.NUMERICIDENTIFIERLOOSE]})`,
          ),
          u(
            "PRERELEASEIDENTIFIER",
            `(?:${a[l.NUMERICIDENTIFIER]}|${a[l.NONNUMERICIDENTIFIER]})`,
          ),
          u(
            "PRERELEASEIDENTIFIERLOOSE",
            `(?:${a[l.NUMERICIDENTIFIERLOOSE]}|${a[l.NONNUMERICIDENTIFIER]})`,
          ),
          u(
            "PRERELEASE",
            `(?:-(${a[l.PRERELEASEIDENTIFIER]}(?:\\.${a[l.PRERELEASEIDENTIFIER]})*))`,
          ),
          u(
            "PRERELEASELOOSE",
            `(?:-?(${a[l.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${a[l.PRERELEASEIDENTIFIERLOOSE]})*))`,
          ),
          u("BUILDIDENTIFIER", "[0-9A-Za-z-]+"),
          u(
            "BUILD",
            `(?:\\+(${a[l.BUILDIDENTIFIER]}(?:\\.${a[l.BUILDIDENTIFIER]})*))`,
          ),
          u(
            "FULLPLAIN",
            `v?${a[l.MAINVERSION]}${a[l.PRERELEASE]}?${a[l.BUILD]}?`,
          ),
          u("FULL", `^${a[l.FULLPLAIN]}$`),
          u(
            "LOOSEPLAIN",
            `[v=\\s]*${a[l.MAINVERSIONLOOSE]}${a[l.PRERELEASELOOSE]}?${a[l.BUILD]}?`,
          ),
          u("LOOSE", `^${a[l.LOOSEPLAIN]}$`),
          u("GTLT", "((?:<|>)?=?)"),
          u("XRANGEIDENTIFIERLOOSE", `${a[l.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`),
          u("XRANGEIDENTIFIER", `${a[l.NUMERICIDENTIFIER]}|x|X|\\*`),
          u(
            "XRANGEPLAIN",
            `[v=\\s]*(${a[l.XRANGEIDENTIFIER]})(?:\\.(${a[l.XRANGEIDENTIFIER]})(?:\\.(${a[l.XRANGEIDENTIFIER]})(?:${a[l.PRERELEASE]})?${a[l.BUILD]}?)?)?`,
          ),
          u(
            "XRANGEPLAINLOOSE",
            `[v=\\s]*(${a[l.XRANGEIDENTIFIERLOOSE]})(?:\\.(${a[l.XRANGEIDENTIFIERLOOSE]})(?:\\.(${a[l.XRANGEIDENTIFIERLOOSE]})(?:${a[l.PRERELEASELOOSE]})?${a[l.BUILD]}?)?)?`,
          ),
          u("XRANGE", `^${a[l.GTLT]}\\s*${a[l.XRANGEPLAIN]}$`),
          u("XRANGELOOSE", `^${a[l.GTLT]}\\s*${a[l.XRANGEPLAINLOOSE]}$`),
          u(
            "COERCE",
            `(^|[^\\d])(\\d{1,${s}})(?:\\.(\\d{1,${s}}))?(?:\\.(\\d{1,${s}}))?(?:$|[^\\d])`,
          ),
          u("COERCERTL", a[l.COERCE], !0),
          u("LONETILDE", "(?:~>?)"),
          u("TILDETRIM", `(\\s*)${a[l.LONETILDE]}\\s+`, !0),
          (t.tildeTrimReplace = "$1~"),
          u("TILDE", `^${a[l.LONETILDE]}${a[l.XRANGEPLAIN]}$`),
          u("TILDELOOSE", `^${a[l.LONETILDE]}${a[l.XRANGEPLAINLOOSE]}$`),
          u("LONECARET", "(?:\\^)"),
          u("CARETTRIM", `(\\s*)${a[l.LONECARET]}\\s+`, !0),
          (t.caretTrimReplace = "$1^"),
          u("CARET", `^${a[l.LONECARET]}${a[l.XRANGEPLAIN]}$`),
          u("CARETLOOSE", `^${a[l.LONECARET]}${a[l.XRANGEPLAINLOOSE]}$`),
          u("COMPARATORLOOSE", `^${a[l.GTLT]}\\s*(${a[l.LOOSEPLAIN]})$|^$`),
          u("COMPARATOR", `^${a[l.GTLT]}\\s*(${a[l.FULLPLAIN]})$|^$`),
          u(
            "COMPARATORTRIM",
            `(\\s*)${a[l.GTLT]}\\s*(${a[l.LOOSEPLAIN]}|${a[l.XRANGEPLAIN]})`,
            !0,
          ),
          (t.comparatorTrimReplace = "$1$2$3"),
          u(
            "HYPHENRANGE",
            `^\\s*(${a[l.XRANGEPLAIN]})\\s+-\\s+(${a[l.XRANGEPLAIN]})\\s*$`,
          ),
          u(
            "HYPHENRANGELOOSE",
            `^\\s*(${a[l.XRANGEPLAINLOOSE]})\\s+-\\s+(${a[l.XRANGEPLAINLOOSE]})\\s*$`,
          ),
          u("STAR", "(<|>)?=?\\s*\\*"),
          u("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$"),
          u("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$");
      },
      688: (e, t, r) => {
        const s = r(5256);
        e.exports = (e, t, r) => s(e, t, ">", r);
      },
      909: (e, t, r) => {
        const s = r(5589);
        e.exports = (e, t, r) => (
          (e = new s(e, r)), (t = new s(t, r)), e.intersects(t, r)
        );
      },
      577: (e, t, r) => {
        const s = r(5256);
        e.exports = (e, t, r) => s(e, t, "<", r);
      },
      3234: (e, t, r) => {
        const s = r(713),
          o = r(5589);
        e.exports = (e, t, r) => {
          let n = null,
            i = null,
            a = null;
          try {
            a = new o(t, r);
          } catch (e) {
            return null;
          }
          return (
            e.forEach((e) => {
              a.test(e) &&
                ((n && -1 !== i.compare(e)) || ((n = e), (i = new s(n, r))));
            }),
            n
          );
        };
      },
      856: (e, t, r) => {
        const s = r(713),
          o = r(5589);
        e.exports = (e, t, r) => {
          let n = null,
            i = null,
            a = null;
          try {
            a = new o(t, r);
          } catch (e) {
            return null;
          }
          return (
            e.forEach((e) => {
              a.test(e) &&
                ((n && 1 !== i.compare(e)) || ((n = e), (i = new s(n, r))));
            }),
            n
          );
        };
      },
      7787: (e, t, r) => {
        const s = r(713),
          o = r(5589),
          n = r(8590);
        e.exports = (e, t) => {
          e = new o(e, t);
          let r = new s("0.0.0");
          if (e.test(r)) return r;
          if (((r = new s("0.0.0-0")), e.test(r))) return r;
          r = null;
          for (let t = 0; t < e.set.length; ++t) {
            const o = e.set[t];
            let i = null;
            o.forEach((e) => {
              const t = new s(e.semver.version);
              switch (e.operator) {
                case ">":
                  0 === t.prerelease.length ? t.patch++ : t.prerelease.push(0),
                    (t.raw = t.format());
                case "":
                case ">=":
                  (i && !n(t, i)) || (i = t);
                  break;
                case "<":
                case "<=":
                  break;
                default:
                  throw new Error(`Unexpected operation: ${e.operator}`);
              }
            }),
              !i || (r && !n(r, i)) || (r = i);
          }
          return r && e.test(r) ? r : null;
        };
      },
      5256: (e, t, r) => {
        const s = r(713),
          o = r(8721),
          { ANY: n } = o,
          i = r(5589),
          a = r(3396),
          l = r(8590),
          c = r(69),
          u = r(7690),
          h = r(177);
        e.exports = (e, t, r, p) => {
          let d, g, f, m, v;
          switch (((e = new s(e, p)), (t = new i(t, p)), r)) {
            case ">":
              (d = l), (g = u), (f = c), (m = ">"), (v = ">=");
              break;
            case "<":
              (d = c), (g = h), (f = l), (m = "<"), (v = "<=");
              break;
            default:
              throw new TypeError('Must provide a hilo val of "<" or ">"');
          }
          if (a(e, t, p)) return !1;
          for (let r = 0; r < t.set.length; ++r) {
            const s = t.set[r];
            let i = null,
              a = null;
            if (
              (s.forEach((e) => {
                e.semver === n && (e = new o(">=0.0.0")),
                  (i = i || e),
                  (a = a || e),
                  d(e.semver, i.semver, p)
                    ? (i = e)
                    : f(e.semver, a.semver, p) && (a = e);
              }),
              i.operator === m || i.operator === v)
            )
              return !1;
            if ((!a.operator || a.operator === m) && g(e, a.semver)) return !1;
            if (a.operator === v && f(e, a.semver)) return !1;
          }
          return !0;
        };
      },
      9009: (e, t, r) => {
        const s = r(3396),
          o = r(4077);
        e.exports = (e, t, r) => {
          const n = [];
          let i = null,
            a = null;
          const l = e.sort((e, t) => o(e, t, r));
          for (const e of l)
            s(e, t, r)
              ? ((a = e), i || (i = e))
              : (a && n.push([i, a]), (a = null), (i = null));
          i && n.push([i, null]);
          const c = [];
          for (const [e, t] of n)
            e === t
              ? c.push(e)
              : t || e !== l[0]
                ? t
                  ? e === l[0]
                    ? c.push(`<=${t}`)
                    : c.push(`${e} - ${t}`)
                  : c.push(`>=${e}`)
                : c.push("*");
          const u = c.join(" || "),
            h = "string" == typeof t.raw ? t.raw : String(t);
          return u.length < h.length ? u : t;
        };
      },
      8376: (e, t, r) => {
        const s = r(5589),
          o = r(8721),
          { ANY: n } = o,
          i = r(3396),
          a = r(4077),
          l = [new o(">=0.0.0-0")],
          c = [new o(">=0.0.0")],
          u = (e, t, r) => {
            if (e === t) return !0;
            if (1 === e.length && e[0].semver === n) {
              if (1 === t.length && t[0].semver === n) return !0;
              e = r.includePrerelease ? l : c;
            }
            if (1 === t.length && t[0].semver === n) {
              if (r.includePrerelease) return !0;
              t = c;
            }
            const s = new Set();
            let o, u, d, g, f, m, v;
            for (const t of e)
              ">" === t.operator || ">=" === t.operator
                ? (o = h(o, t, r))
                : "<" === t.operator || "<=" === t.operator
                  ? (u = p(u, t, r))
                  : s.add(t.semver);
            if (s.size > 1) return null;
            if (o && u) {
              if (((d = a(o.semver, u.semver, r)), d > 0)) return null;
              if (0 === d && (">=" !== o.operator || "<=" !== u.operator))
                return null;
            }
            for (const e of s) {
              if (o && !i(e, String(o), r)) return null;
              if (u && !i(e, String(u), r)) return null;
              for (const s of t) if (!i(e, String(s), r)) return !1;
              return !0;
            }
            let E =
                !(!u || r.includePrerelease || !u.semver.prerelease.length) &&
                u.semver,
              y =
                !(!o || r.includePrerelease || !o.semver.prerelease.length) &&
                o.semver;
            E &&
              1 === E.prerelease.length &&
              "<" === u.operator &&
              0 === E.prerelease[0] &&
              (E = !1);
            for (const e of t) {
              if (
                ((v = v || ">" === e.operator || ">=" === e.operator),
                (m = m || "<" === e.operator || "<=" === e.operator),
                o)
              )
                if (
                  (y &&
                    e.semver.prerelease &&
                    e.semver.prerelease.length &&
                    e.semver.major === y.major &&
                    e.semver.minor === y.minor &&
                    e.semver.patch === y.patch &&
                    (y = !1),
                  ">" === e.operator || ">=" === e.operator)
                ) {
                  if (((g = h(o, e, r)), g === e && g !== o)) return !1;
                } else if (">=" === o.operator && !i(o.semver, String(e), r))
                  return !1;
              if (u)
                if (
                  (E &&
                    e.semver.prerelease &&
                    e.semver.prerelease.length &&
                    e.semver.major === E.major &&
                    e.semver.minor === E.minor &&
                    e.semver.patch === E.patch &&
                    (E = !1),
                  "<" === e.operator || "<=" === e.operator)
                ) {
                  if (((f = p(u, e, r)), f === e && f !== u)) return !1;
                } else if ("<=" === u.operator && !i(u.semver, String(e), r))
                  return !1;
              if (!e.operator && (u || o) && 0 !== d) return !1;
            }
            return !(
              (o && m && !u && 0 !== d) ||
              (u && v && !o && 0 !== d) ||
              y ||
              E
            );
          },
          h = (e, t, r) => {
            if (!e) return t;
            const s = a(e.semver, t.semver, r);
            return s > 0
              ? e
              : s < 0 || (">" === t.operator && ">=" === e.operator)
                ? t
                : e;
          },
          p = (e, t, r) => {
            if (!e) return t;
            const s = a(e.semver, t.semver, r);
            return s < 0
              ? e
              : s > 0 || ("<" === t.operator && "<=" === e.operator)
                ? t
                : e;
          };
        e.exports = (e, t, r = {}) => {
          if (e === t) return !0;
          (e = new s(e, r)), (t = new s(t, r));
          let o = !1;
          e: for (const s of e.set) {
            for (const e of t.set) {
              const t = u(s, e, r);
              if (((o = o || null !== t), t)) continue e;
            }
            if (o) return !1;
          }
          return !0;
        };
      },
      5471: (e, t, r) => {
        const s = r(5589);
        e.exports = (e, t) =>
          new s(e, t).set.map((e) =>
            e
              .map((e) => e.value)
              .join(" ")
              .trim()
              .split(" "),
          );
      },
      409: (e, t, r) => {
        const s = r(5589);
        e.exports = (e, t) => {
          try {
            return new s(e, t).range || "*";
          } catch (e) {
            return null;
          }
        };
      },
      6279: (e) => {
        "use strict";
        e.exports = function (e) {
          e.prototype[Symbol.iterator] = function* () {
            for (let e = this.head; e; e = e.next) yield e.value;
          };
        };
      },
      4393: (e, t, r) => {
        "use strict";
        function s(e) {
          var t = this;
          if (
            (t instanceof s || (t = new s()),
            (t.tail = null),
            (t.head = null),
            (t.length = 0),
            e && "function" == typeof e.forEach)
          )
            e.forEach(function (e) {
              t.push(e);
            });
          else if (arguments.length > 0)
            for (var r = 0, o = arguments.length; r < o; r++)
              t.push(arguments[r]);
          return t;
        }
        function o(e, t) {
          (e.tail = new i(t, e.tail, null, e)),
            e.head || (e.head = e.tail),
            e.length++;
        }
        function n(e, t) {
          (e.head = new i(t, null, e.head, e)),
            e.tail || (e.tail = e.head),
            e.length++;
        }
        function i(e, t, r, s) {
          if (!(this instanceof i)) return new i(e, t, r, s);
          (this.list = s),
            (this.value = e),
            t ? ((t.next = this), (this.prev = t)) : (this.prev = null),
            r ? ((r.prev = this), (this.next = r)) : (this.next = null);
        }
        (e.exports = s),
          (s.Node = i),
          (s.create = s),
          (s.prototype.removeNode = function (e) {
            if (e.list !== this)
              throw new Error(
                "removing node which does not belong to this list",
              );
            var t = e.next,
              r = e.prev;
            return (
              t && (t.prev = r),
              r && (r.next = t),
              e === this.head && (this.head = t),
              e === this.tail && (this.tail = r),
              e.list.length--,
              (e.next = null),
              (e.prev = null),
              (e.list = null),
              t
            );
          }),
          (s.prototype.unshiftNode = function (e) {
            if (e !== this.head) {
              e.list && e.list.removeNode(e);
              var t = this.head;
              (e.list = this),
                (e.next = t),
                t && (t.prev = e),
                (this.head = e),
                this.tail || (this.tail = e),
                this.length++;
            }
          }),
          (s.prototype.pushNode = function (e) {
            if (e !== this.tail) {
              e.list && e.list.removeNode(e);
              var t = this.tail;
              (e.list = this),
                (e.prev = t),
                t && (t.next = e),
                (this.tail = e),
                this.head || (this.head = e),
                this.length++;
            }
          }),
          (s.prototype.push = function () {
            for (var e = 0, t = arguments.length; e < t; e++)
              o(this, arguments[e]);
            return this.length;
          }),
          (s.prototype.unshift = function () {
            for (var e = 0, t = arguments.length; e < t; e++)
              n(this, arguments[e]);
            return this.length;
          }),
          (s.prototype.pop = function () {
            if (this.tail) {
              var e = this.tail.value;
              return (
                (this.tail = this.tail.prev),
                this.tail ? (this.tail.next = null) : (this.head = null),
                this.length--,
                e
              );
            }
          }),
          (s.prototype.shift = function () {
            if (this.head) {
              var e = this.head.value;
              return (
                (this.head = this.head.next),
                this.head ? (this.head.prev = null) : (this.tail = null),
                this.length--,
                e
              );
            }
          }),
          (s.prototype.forEach = function (e, t) {
            t = t || this;
            for (var r = this.head, s = 0; null !== r; s++)
              e.call(t, r.value, s, this), (r = r.next);
          }),
          (s.prototype.forEachReverse = function (e, t) {
            t = t || this;
            for (var r = this.tail, s = this.length - 1; null !== r; s--)
              e.call(t, r.value, s, this), (r = r.prev);
          }),
          (s.prototype.get = function (e) {
            for (var t = 0, r = this.head; null !== r && t < e; t++) r = r.next;
            if (t === e && null !== r) return r.value;
          }),
          (s.prototype.getReverse = function (e) {
            for (var t = 0, r = this.tail; null !== r && t < e; t++) r = r.prev;
            if (t === e && null !== r) return r.value;
          }),
          (s.prototype.map = function (e, t) {
            t = t || this;
            for (var r = new s(), o = this.head; null !== o; )
              r.push(e.call(t, o.value, this)), (o = o.next);
            return r;
          }),
          (s.prototype.mapReverse = function (e, t) {
            t = t || this;
            for (var r = new s(), o = this.tail; null !== o; )
              r.push(e.call(t, o.value, this)), (o = o.prev);
            return r;
          }),
          (s.prototype.reduce = function (e, t) {
            var r,
              s = this.head;
            if (arguments.length > 1) r = t;
            else {
              if (!this.head)
                throw new TypeError(
                  "Reduce of empty list with no initial value",
                );
              (s = this.head.next), (r = this.head.value);
            }
            for (var o = 0; null !== s; o++)
              (r = e(r, s.value, o)), (s = s.next);
            return r;
          }),
          (s.prototype.reduceReverse = function (e, t) {
            var r,
              s = this.tail;
            if (arguments.length > 1) r = t;
            else {
              if (!this.tail)
                throw new TypeError(
                  "Reduce of empty list with no initial value",
                );
              (s = this.tail.prev), (r = this.tail.value);
            }
            for (var o = this.length - 1; null !== s; o--)
              (r = e(r, s.value, o)), (s = s.prev);
            return r;
          }),
          (s.prototype.toArray = function () {
            for (
              var e = new Array(this.length), t = 0, r = this.head;
              null !== r;
              t++
            )
              (e[t] = r.value), (r = r.next);
            return e;
          }),
          (s.prototype.toArrayReverse = function () {
            for (
              var e = new Array(this.length), t = 0, r = this.tail;
              null !== r;
              t++
            )
              (e[t] = r.value), (r = r.prev);
            return e;
          }),
          (s.prototype.slice = function (e, t) {
            (t = t || this.length) < 0 && (t += this.length),
              (e = e || 0) < 0 && (e += this.length);
            var r = new s();
            if (t < e || t < 0) return r;
            e < 0 && (e = 0), t > this.length && (t = this.length);
            for (var o = 0, n = this.head; null !== n && o < e; o++) n = n.next;
            for (; null !== n && o < t; o++, n = n.next) r.push(n.value);
            return r;
          }),
          (s.prototype.sliceReverse = function (e, t) {
            (t = t || this.length) < 0 && (t += this.length),
              (e = e || 0) < 0 && (e += this.length);
            var r = new s();
            if (t < e || t < 0) return r;
            e < 0 && (e = 0), t > this.length && (t = this.length);
            for (var o = this.length, n = this.tail; null !== n && o > t; o--)
              n = n.prev;
            for (; null !== n && o > e; o--, n = n.prev) r.push(n.value);
            return r;
          }),
          (s.prototype.splice = function (e, t, ...r) {
            e > this.length && (e = this.length - 1),
              e < 0 && (e = this.length + e);
            for (var s = 0, o = this.head; null !== o && s < e; s++) o = o.next;
            var n,
              a,
              l,
              c,
              u = [];
            for (s = 0; o && s < t; s++)
              u.push(o.value), (o = this.removeNode(o));
            for (
              null === o && (o = this.tail),
                o !== this.head && o !== this.tail && (o = o.prev),
                s = 0;
              s < r.length;
              s++
            )
              (n = this),
                (a = o),
                (l = r[s]),
                (c = void 0),
                null ===
                  (c =
                    a === n.head
                      ? new i(l, null, a, n)
                      : new i(l, a, a.next, n)).next && (n.tail = c),
                null === c.prev && (n.head = c),
                n.length++,
                (o = c);
            return u;
          }),
          (s.prototype.reverse = function () {
            for (
              var e = this.head, t = this.tail, r = e;
              null !== r;
              r = r.prev
            ) {
              var s = r.prev;
              (r.prev = r.next), (r.next = s);
            }
            return (this.head = t), (this.tail = e), this;
          });
        try {
          r(6279)(s);
        } catch (e) {}
      },
      9285: (e) => {
        class t {
          constructor(e) {
            (this.value = e), (this.next = void 0);
          }
        }
        class r {
          constructor() {
            this.clear();
          }
          enqueue(e) {
            const r = new t(e);
            this._head
              ? ((this._tail.next = r), (this._tail = r))
              : ((this._head = r), (this._tail = r)),
              this._size++;
          }
          dequeue() {
            const e = this._head;
            if (e) return (this._head = this._head.next), this._size--, e.value;
          }
          clear() {
            (this._head = void 0), (this._tail = void 0), (this._size = 0);
          }
          get size() {
            return this._size;
          }
          *[Symbol.iterator]() {
            let e = this._head;
            for (; e; ) yield e.value, (e = e.next);
          }
        }
        e.exports = r;
      },
      3920: (e) => {
        "use strict";
        e.exports = require("prettier");
      },
      9496: (e) => {
        "use strict";
        e.exports = require("vscode");
      },
      2081: (e) => {
        "use strict";
        e.exports = require("child_process");
      },
      7147: (e) => {
        "use strict";
        e.exports = require("fs");
      },
      2037: (e) => {
        "use strict";
        e.exports = require("os");
      },
      1017: (e) => {
        "use strict";
        e.exports = require("path");
      },
      5034: (e) => {
        "use strict";
        e.exports = require("url");
      },
      3837: (e) => {
        "use strict";
        e.exports = require("util");
      },
      1267: (e) => {
        "use strict";
        e.exports = require("worker_threads");
      },
      9789: (e) => {
        "use strict";
        e.exports = JSON.parse(
          '{"assert":true,"node:assert":[">= 14.18 && < 15",">= 16"],"assert/strict":">= 15","node:assert/strict":">= 16","async_hooks":">= 8","node:async_hooks":[">= 14.18 && < 15",">= 16"],"buffer_ieee754":">= 0.5 && < 0.9.7","buffer":true,"node:buffer":[">= 14.18 && < 15",">= 16"],"child_process":true,"node:child_process":[">= 14.18 && < 15",">= 16"],"cluster":">= 0.5","node:cluster":[">= 14.18 && < 15",">= 16"],"console":true,"node:console":[">= 14.18 && < 15",">= 16"],"constants":true,"node:constants":[">= 14.18 && < 15",">= 16"],"crypto":true,"node:crypto":[">= 14.18 && < 15",">= 16"],"_debug_agent":">= 1 && < 8","_debugger":"< 8","dgram":true,"node:dgram":[">= 14.18 && < 15",">= 16"],"diagnostics_channel":[">= 14.17 && < 15",">= 15.1"],"node:diagnostics_channel":[">= 14.18 && < 15",">= 16"],"dns":true,"node:dns":[">= 14.18 && < 15",">= 16"],"dns/promises":">= 15","node:dns/promises":">= 16","domain":">= 0.7.12","node:domain":[">= 14.18 && < 15",">= 16"],"events":true,"node:events":[">= 14.18 && < 15",">= 16"],"freelist":"< 6","fs":true,"node:fs":[">= 14.18 && < 15",">= 16"],"fs/promises":[">= 10 && < 10.1",">= 14"],"node:fs/promises":[">= 14.18 && < 15",">= 16"],"_http_agent":">= 0.11.1","node:_http_agent":[">= 14.18 && < 15",">= 16"],"_http_client":">= 0.11.1","node:_http_client":[">= 14.18 && < 15",">= 16"],"_http_common":">= 0.11.1","node:_http_common":[">= 14.18 && < 15",">= 16"],"_http_incoming":">= 0.11.1","node:_http_incoming":[">= 14.18 && < 15",">= 16"],"_http_outgoing":">= 0.11.1","node:_http_outgoing":[">= 14.18 && < 15",">= 16"],"_http_server":">= 0.11.1","node:_http_server":[">= 14.18 && < 15",">= 16"],"http":true,"node:http":[">= 14.18 && < 15",">= 16"],"http2":">= 8.8","node:http2":[">= 14.18 && < 15",">= 16"],"https":true,"node:https":[">= 14.18 && < 15",">= 16"],"inspector":">= 8","node:inspector":[">= 14.18 && < 15",">= 16"],"inspector/promises":[">= 19"],"node:inspector/promises":[">= 19"],"_linklist":"< 8","module":true,"node:module":[">= 14.18 && < 15",">= 16"],"net":true,"node:net":[">= 14.18 && < 15",">= 16"],"node-inspect/lib/_inspect":">= 7.6 && < 12","node-inspect/lib/internal/inspect_client":">= 7.6 && < 12","node-inspect/lib/internal/inspect_repl":">= 7.6 && < 12","os":true,"node:os":[">= 14.18 && < 15",">= 16"],"path":true,"node:path":[">= 14.18 && < 15",">= 16"],"path/posix":">= 15.3","node:path/posix":">= 16","path/win32":">= 15.3","node:path/win32":">= 16","perf_hooks":">= 8.5","node:perf_hooks":[">= 14.18 && < 15",">= 16"],"process":">= 1","node:process":[">= 14.18 && < 15",">= 16"],"punycode":">= 0.5","node:punycode":[">= 14.18 && < 15",">= 16"],"querystring":true,"node:querystring":[">= 14.18 && < 15",">= 16"],"readline":true,"node:readline":[">= 14.18 && < 15",">= 16"],"readline/promises":">= 17","node:readline/promises":">= 17","repl":true,"node:repl":[">= 14.18 && < 15",">= 16"],"smalloc":">= 0.11.5 && < 3","_stream_duplex":">= 0.9.4","node:_stream_duplex":[">= 14.18 && < 15",">= 16"],"_stream_transform":">= 0.9.4","node:_stream_transform":[">= 14.18 && < 15",">= 16"],"_stream_wrap":">= 1.4.1","node:_stream_wrap":[">= 14.18 && < 15",">= 16"],"_stream_passthrough":">= 0.9.4","node:_stream_passthrough":[">= 14.18 && < 15",">= 16"],"_stream_readable":">= 0.9.4","node:_stream_readable":[">= 14.18 && < 15",">= 16"],"_stream_writable":">= 0.9.4","node:_stream_writable":[">= 14.18 && < 15",">= 16"],"stream":true,"node:stream":[">= 14.18 && < 15",">= 16"],"stream/consumers":">= 16.7","node:stream/consumers":">= 16.7","stream/promises":">= 15","node:stream/promises":">= 16","stream/web":">= 16.5","node:stream/web":">= 16.5","string_decoder":true,"node:string_decoder":[">= 14.18 && < 15",">= 16"],"sys":[">= 0.4 && < 0.7",">= 0.8"],"node:sys":[">= 14.18 && < 15",">= 16"],"test/reporters":[">= 19.9",">= 20"],"node:test/reporters":[">= 19.9",">= 20"],"node:test":[">= 16.17 && < 17",">= 18"],"timers":true,"node:timers":[">= 14.18 && < 15",">= 16"],"timers/promises":">= 15","node:timers/promises":">= 16","_tls_common":">= 0.11.13","node:_tls_common":[">= 14.18 && < 15",">= 16"],"_tls_legacy":">= 0.11.3 && < 10","_tls_wrap":">= 0.11.3","node:_tls_wrap":[">= 14.18 && < 15",">= 16"],"tls":true,"node:tls":[">= 14.18 && < 15",">= 16"],"trace_events":">= 10","node:trace_events":[">= 14.18 && < 15",">= 16"],"tty":true,"node:tty":[">= 14.18 && < 15",">= 16"],"url":true,"node:url":[">= 14.18 && < 15",">= 16"],"util":true,"node:util":[">= 14.18 && < 15",">= 16"],"util/types":">= 15.3","node:util/types":">= 16","v8/tools/arguments":">= 10 && < 12","v8/tools/codemap":[">= 4.4 && < 5",">= 5.2 && < 12"],"v8/tools/consarray":[">= 4.4 && < 5",">= 5.2 && < 12"],"v8/tools/csvparser":[">= 4.4 && < 5",">= 5.2 && < 12"],"v8/tools/logreader":[">= 4.4 && < 5",">= 5.2 && < 12"],"v8/tools/profile_view":[">= 4.4 && < 5",">= 5.2 && < 12"],"v8/tools/splaytree":[">= 4.4 && < 5",">= 5.2 && < 12"],"v8":">= 1","node:v8":[">= 14.18 && < 15",">= 16"],"vm":true,"node:vm":[">= 14.18 && < 15",">= 16"],"wasi":[">= 13.4 && < 13.5",">= 20"],"node:wasi":">= 20","worker_threads":">= 11.7","node:worker_threads":[">= 14.18 && < 15",">= 16"],"zlib":">= 0.5","node:zlib":[">= 14.18 && < 15",">= 16"]}',
        );
      },
      2197: (e) => {
        "use strict";
        e.exports = JSON.parse(
          '{"assert":true,"node:assert":[">= 14.18 && < 15",">= 16"],"assert/strict":">= 15","node:assert/strict":">= 16","async_hooks":">= 8","node:async_hooks":[">= 14.18 && < 15",">= 16"],"buffer_ieee754":">= 0.5 && < 0.9.7","buffer":true,"node:buffer":[">= 14.18 && < 15",">= 16"],"child_process":true,"node:child_process":[">= 14.18 && < 15",">= 16"],"cluster":">= 0.5","node:cluster":[">= 14.18 && < 15",">= 16"],"console":true,"node:console":[">= 14.18 && < 15",">= 16"],"constants":true,"node:constants":[">= 14.18 && < 15",">= 16"],"crypto":true,"node:crypto":[">= 14.18 && < 15",">= 16"],"_debug_agent":">= 1 && < 8","_debugger":"< 8","dgram":true,"node:dgram":[">= 14.18 && < 15",">= 16"],"diagnostics_channel":[">= 14.17 && < 15",">= 15.1"],"node:diagnostics_channel":[">= 14.18 && < 15",">= 16"],"dns":true,"node:dns":[">= 14.18 && < 15",">= 16"],"dns/promises":">= 15","node:dns/promises":">= 16","domain":">= 0.7.12","node:domain":[">= 14.18 && < 15",">= 16"],"events":true,"node:events":[">= 14.18 && < 15",">= 16"],"freelist":"< 6","fs":true,"node:fs":[">= 14.18 && < 15",">= 16"],"fs/promises":[">= 10 && < 10.1",">= 14"],"node:fs/promises":[">= 14.18 && < 15",">= 16"],"_http_agent":">= 0.11.1","node:_http_agent":[">= 14.18 && < 15",">= 16"],"_http_client":">= 0.11.1","node:_http_client":[">= 14.18 && < 15",">= 16"],"_http_common":">= 0.11.1","node:_http_common":[">= 14.18 && < 15",">= 16"],"_http_incoming":">= 0.11.1","node:_http_incoming":[">= 14.18 && < 15",">= 16"],"_http_outgoing":">= 0.11.1","node:_http_outgoing":[">= 14.18 && < 15",">= 16"],"_http_server":">= 0.11.1","node:_http_server":[">= 14.18 && < 15",">= 16"],"http":true,"node:http":[">= 14.18 && < 15",">= 16"],"http2":">= 8.8","node:http2":[">= 14.18 && < 15",">= 16"],"https":true,"node:https":[">= 14.18 && < 15",">= 16"],"inspector":">= 8","node:inspector":[">= 14.18 && < 15",">= 16"],"inspector/promises":[">= 19"],"node:inspector/promises":[">= 19"],"_linklist":"< 8","module":true,"node:module":[">= 14.18 && < 15",">= 16"],"net":true,"node:net":[">= 14.18 && < 15",">= 16"],"node-inspect/lib/_inspect":">= 7.6 && < 12","node-inspect/lib/internal/inspect_client":">= 7.6 && < 12","node-inspect/lib/internal/inspect_repl":">= 7.6 && < 12","os":true,"node:os":[">= 14.18 && < 15",">= 16"],"path":true,"node:path":[">= 14.18 && < 15",">= 16"],"path/posix":">= 15.3","node:path/posix":">= 16","path/win32":">= 15.3","node:path/win32":">= 16","perf_hooks":">= 8.5","node:perf_hooks":[">= 14.18 && < 15",">= 16"],"process":">= 1","node:process":[">= 14.18 && < 15",">= 16"],"punycode":">= 0.5","node:punycode":[">= 14.18 && < 15",">= 16"],"querystring":true,"node:querystring":[">= 14.18 && < 15",">= 16"],"readline":true,"node:readline":[">= 14.18 && < 15",">= 16"],"readline/promises":">= 17","node:readline/promises":">= 17","repl":true,"node:repl":[">= 14.18 && < 15",">= 16"],"smalloc":">= 0.11.5 && < 3","_stream_duplex":">= 0.9.4","node:_stream_duplex":[">= 14.18 && < 15",">= 16"],"_stream_transform":">= 0.9.4","node:_stream_transform":[">= 14.18 && < 15",">= 16"],"_stream_wrap":">= 1.4.1","node:_stream_wrap":[">= 14.18 && < 15",">= 16"],"_stream_passthrough":">= 0.9.4","node:_stream_passthrough":[">= 14.18 && < 15",">= 16"],"_stream_readable":">= 0.9.4","node:_stream_readable":[">= 14.18 && < 15",">= 16"],"_stream_writable":">= 0.9.4","node:_stream_writable":[">= 14.18 && < 15",">= 16"],"stream":true,"node:stream":[">= 14.18 && < 15",">= 16"],"stream/consumers":">= 16.7","node:stream/consumers":">= 16.7","stream/promises":">= 15","node:stream/promises":">= 16","stream/web":">= 16.5","node:stream/web":">= 16.5","string_decoder":true,"node:string_decoder":[">= 14.18 && < 15",">= 16"],"sys":[">= 0.4 && < 0.7",">= 0.8"],"node:sys":[">= 14.18 && < 15",">= 16"],"node:test":[">= 16.17 && < 17",">= 18"],"timers":true,"node:timers":[">= 14.18 && < 15",">= 16"],"timers/promises":">= 15","node:timers/promises":">= 16","_tls_common":">= 0.11.13","node:_tls_common":[">= 14.18 && < 15",">= 16"],"_tls_legacy":">= 0.11.3 && < 10","_tls_wrap":">= 0.11.3","node:_tls_wrap":[">= 14.18 && < 15",">= 16"],"tls":true,"node:tls":[">= 14.18 && < 15",">= 16"],"trace_events":">= 10","node:trace_events":[">= 14.18 && < 15",">= 16"],"tty":true,"node:tty":[">= 14.18 && < 15",">= 16"],"url":true,"node:url":[">= 14.18 && < 15",">= 16"],"util":true,"node:util":[">= 14.18 && < 15",">= 16"],"util/types":">= 15.3","node:util/types":">= 16","v8/tools/arguments":">= 10 && < 12","v8/tools/codemap":[">= 4.4 && < 5",">= 5.2 && < 12"],"v8/tools/consarray":[">= 4.4 && < 5",">= 5.2 && < 12"],"v8/tools/csvparser":[">= 4.4 && < 5",">= 5.2 && < 12"],"v8/tools/logreader":[">= 4.4 && < 5",">= 5.2 && < 12"],"v8/tools/profile_view":[">= 4.4 && < 5",">= 5.2 && < 12"],"v8/tools/splaytree":[">= 4.4 && < 5",">= 5.2 && < 12"],"v8":">= 1","node:v8":[">= 14.18 && < 15",">= 16"],"vm":true,"node:vm":[">= 14.18 && < 15",">= 16"],"wasi":">= 13.4 && < 13.5","worker_threads":">= 11.7","node:worker_threads":[">= 14.18 && < 15",">= 16"],"zlib":">= 0.5","node:zlib":[">= 14.18 && < 15",">= 16"]}',
        );
      },
    },
    t = {};
  function r(s) {
    var o = t[s];
    if (void 0 !== o) return o.exports;
    var n = (t[s] = { exports: {} });
    return e[s](n, n.exports, r), n.exports;
  }
  var s = {};
  (() => {
    "use strict";
    var e = s;
    Object.defineProperty(e, "__esModule", { value: !0 }),
      (e.activate = void 0);
    const t = r(9496),
      o = r(5415),
      n = r(9854),
      i = r(604),
      a = r(1923),
      l = r(2331),
      c = r(3938),
      u = r(9923),
      h = r(6906);
    e.activate = function (e) {
      const r = new n.LoggingService();
      r.logInfo("Extension Name: esbenp.prettier-vscode."),
        r.logInfo("Extension Version: 10.1.0.");
      const { enable: s, enableDebugLogs: p } = (0, u.getConfig)();
      if ((p && r.setOutputLevel("DEBUG"), !s))
        return (
          r.logInfo(h.EXTENSION_DISABLED),
          void e.subscriptions.push(
            t.workspace.onDidChangeConfiguration((e) => {
              e.affectsConfiguration("prettier.enable") &&
                r.logWarning(h.RESTART_TO_ENABLE);
            }),
          )
        );
      const d = new i.ModuleResolver(r),
        g = new c.TemplateService(r, d.getGlobalPrettierInstance()),
        f = new l.StatusBar(),
        m = new a.default(d, r, f);
      m.registerGlobal()
        .then(() => {
          const s = (0, o.createConfigFile)(g),
            n = t.commands.registerCommand("prettier.createConfigFile", s),
            i = t.commands.registerCommand("prettier.openOutput", () => {
              r.show();
            }),
            a = t.commands.registerCommand(
              "prettier.forceFormatDocument",
              m.forceFormatDocument,
            );
          e.subscriptions.push(m, n, i, a, ...m.registerDisposables());
        })
        .catch((e) => {
          r.logError("Error registering extension", e);
        });
    };
  })(),
    (module.exports = s);
})();
//# sourceMappingURL=extension.js.map
