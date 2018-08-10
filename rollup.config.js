import commonjs from 'rollup-plugin-commonjs';
import filesize from 'rollup-plugin-filesize';
import resolve from 'rollup-plugin-node-resolve';
import { uglify } from 'rollup-plugin-uglify';
import pkg from './package.json';
import babel from 'rollup-plugin-babel';

const input = 'src/index.ts';
const external = ['react', 'formik'];

const allExternals = external.concat(Object.keys(pkg.dependencies));

const check = id =>
  allExternals.filter(ext => id.substr(0, ext.length) === ext).length > 0;

const buildUMD = ({ isProduction = true }) => ({
  input,
  external,
  output: {
    name: 'FormikFields',
    file: `dist/formik-fields.umd${isProduction ? '.min' : ''}.js`,
    format: 'umd',
    sourcemap: true,
    globals: {
      react: 'React',
      formik: 'Formik'
    }
  },
  plugins: [
    babel({ exclude: 'node_modules/**', runtimeHelpers: true }),
    resolve({ extensions: ['.ts', '.tsx', '.js', '.jsx'] }),
    commonjs(),
    isProduction && filesize(),
    isProduction &&
      uglify({
        compress: {
          keep_infinity: true,
          pure_getters: true
        },
        warnings: true
      })
  ]
});

const buildBundle = ({ isCommonjs = false }) => ({
  input,
  external: check,
  output: {
    file: isCommonjs ? pkg.main : pkg.module,
    format: isCommonjs ? 'cjs' : 'es',
    sourcemap: true
  },
  plugins: [
    resolve({ extensions: ['.ts', '.tsx', '.js', '.jsx'] }),
    babel({
      exclude: 'node_modules/**',
      runtimeHelpers: true,
      envName: isCommonjs ? 'commonjs' : process.env.NODE_ENV
    }),
    filesize()
  ]
});

export default [
  buildUMD({ isProduction: false }),
  buildUMD({ isProduction: true }),
  buildBundle({ isCommonjs: true }),
  buildBundle({ isCommonjs: false })
];
