module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
    '.+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$':
      'jest-transform-stub'
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  modulePathIgnorePatterns: ['.qawolf']
}
process.env = Object.assign(process.env, {
  NPM_DEVS_VISUALIZER_CLIENT_ID: 'aaaaaaaa',
  NPM_DEVS_VISUALIZER_CLIENT_SECRET: 'bbbbbbbb',
  NPM_DEVS_VISUALIZER_REDIECT_URL: 'http://localhost:1234/'
})
