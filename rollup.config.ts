import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import sourceMaps from 'rollup-plugin-sourcemaps';
import typescript from 'rollup-plugin-typescript2';
import { uglify } from 'rollup-plugin-uglify';
import filesize from 'rollup-plugin-filesize';
import json from 'rollup-plugin-json';
import pkg from './package.json';

const input = 'src/index.ts';
const external = ['react', 'formik'];

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
    json(),
    typescript({ useTsconfigDeclarationDir: true }),
    commonjs(),
    resolve(),
    sourceMaps(),
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

export default [
  buildUMD({ isProduction: true }),
  buildUMD({ isProduction: false }),
  {
    input,
    external: external.concat(Object.keys(pkg.dependencies)),
    output: [
      {
        file: pkg.main,
        format: 'cjs',
        sourcemap: true
      },
      {
        file: pkg.module,
        format: 'es',
        sourcemap: true
      }
    ],
    plugins: [
      json(),
      typescript({ useTsconfigDeclarationDir: true }),
      resolve(),
      sourceMaps(),
      filesize()
    ]
  }
];
