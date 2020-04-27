export default {
  methods: {
    hasBackground() {
      return this.getBackgroundUrl();
    },
    getBackgroundUrl(user) {
      if (user && user.profile) {
        const { background } = user.profile;
        if (background) {
          return `background-image: url('${background}');`;
        }
      }
      return null;
    }
  }
}