import { colors } from "/imports/colors";

export default {
  namespaced: true,
  state: {
    defaultNavigationColor: "#363636",
    navigationColor: "#363636",
    navColor: "#555555"
  },
  mutations: {
    updateNavigationColor(state, color) {
      state.navigationColor = color;
    }
  },
  getters: {
    isNavigationColorDark: (state) => colors.isDark(state.navigationColor),
    navigationColorBrightness: (state) => colors.getBrightness(state.navigationColor),
    isContentDark: (state, getters) => getters.navigationColorBrightness < 60 
    || getters.navigationColorBrightness > 128
  },
  actions: {
    setNavigationColor(context, color) {
      context.commit("updateNavigationColor", color);
    },
    resetNavigationColor(context) {
      context.commit("updateNavigationColor", context.state.defaultNavigationColor);
    }
  }
};
