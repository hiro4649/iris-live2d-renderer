export function createBrowserRendererAdapter() {
  return {
    adapter_kind: "browser_live2d_renderer",
    implementation_status: "scaffold_only",
    starts_real_live2d_renderer: false,
    status() {
      return {
        browser_surface_available: false,
        cubism_runtime_loaded: false,
        model_loaded: false,
        scene_loaded: false,
        fresh_heartbeat: false,
        renderer_ready: false,
      };
    },
  };
}
