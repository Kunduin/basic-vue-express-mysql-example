module.exports = {
  lintOnSave: process.env.NODE_ENV !== "production",
  devServer: {
    proxy: {
      "/api": {
        target: "http://localhost:4000/",
        ws: true,
        changeOrigin: true
      },
      "/public": {
        target: "http://localhost:4000/",
        ws: true,
        changeOrigin: true
      }
    }
  },
  configureWebpack: {
    devtool: "#eval-source-map"
  }
};
