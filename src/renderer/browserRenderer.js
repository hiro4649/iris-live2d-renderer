export function createBrowserRendererAdapter() {
  return {
    adapter_kind: "browser_live2d_renderer",
    implementation_status: "cubism_web_minimal",
    starts_real_live2d_renderer: false,
    cue_delivery_route: "browser_polling",
    heartbeat_route: "browser_heartbeat",
    status() {
      return {
        browser_surface_available: true,
        cubism_runtime_loaded: false,
        real_model_load_supported: false,
        model_loaded: false,
        scene_loaded: false,
        fresh_heartbeat: false,
        renderer_ready: false,
      };
    },
  };
}
