//'экспорт инструментов для того чтоб их использвать объявлем их в переменную//
const { src, dest, series, watch } = require("gulp");
const concat = require("gulp-concat");
const htmlMin = require("gulp-htmlmin");
const autoprefixer = require("gulp-autoprefixer");
const cleanCSS = require("gulp-clean-css");
const svgSprite = require("gulp-svg-sprite");
const imagen = require("gulp-image");
const babel = require("gulp-babel");
const uglify = require("gulp-uglify-es").default;
const del = require("del");
const notify = require("gulp-notify");
const sourcemaps = require("gulp-sourcemaps");
const browserSync = require("browser-sync").create(); //вызывает ф-ю create по спецификации
const sass = require("gulp-sass")(require("sass"));
var rename = require("gulp-rename");
const fileinclude = require("gulp-file-include");

//объединение html ФАЙЛОВ
const htmlInclude = () => {
  return src("src/*.html")
    .pipe(
      fileinclude({
        prefix: "@",
        basepath: "@file",
        maxRecursion: 100,
      }),
    )
    .pipe(dest("dist"))
    .pipe(browserSync.stream());
};

const htmlIncludeMinify = () => {
  return src("src/*.html")
    .pipe(
      fileinclude({
        prefix: "@",
        basepath: "@file",
        maxRecursion: 100,
      }),
    )
    .pipe(
      htmlMin({
        collapseWhitespace: true, //указываем параметры
      }),
    )
    .pipe(dest("dist"))
    .pipe(browserSync.stream());
};

//ф-я HTMLmin
const htmlDiv = () => {
  return src("src/**/*.html").pipe(dest("dist")).pipe(browserSync.stream()); //получаем все изменения файлов которые будут происходить
};

const htmlMinify = () => {
  return src("src/**/*.html")
    .pipe(
      htmlMin({
        collapseWhitespace: true, //указываем параметры
      }),
    )
    .pipe(dest("dist"))
    .pipe(browserSync.stream()); //получаем все изменения файлов которые будут происходить
};

// export const htmlInclude = () => {
//   return app.gulp.src([`${app.paths.base.src}/*.html`])
//     .pipe(fileInclude({
//       prefix: '@',
//       basepath: '@file',
//       maxRecursion: 100
//     }))
//     .pipe(typograf({
//       locale: ['ru', 'en-US']
//     }))
//     .pipe(app.gulp.dest(app.paths.base.build))
//     .pipe(browserSync.stream());
// }

//удвление дирректорий
const cleaner = () => {
  return del(["dist"]);
};

//перенос resources без зависимостей
const resources = () => {
  return src("src/resource/**") //берем из папки и переносим
    .pipe(dest("dist"));
};

//функция обработка стилей  (gulp task)
// const styles = () => {
//   return src('src/style/**/*.css') //получаем ф-лф из папки и ф-лов
//   .pipe(concat('main.css')) // объединяем полученные файлы в указанный ф-л
//   .pipe(autoprefixer({ //pipe пишем после объединения тк с одним ф-м работать проще
//     cascade: false
//   }))
//   .pipe(cleanCSS({
//     level: 2
//   }))
//   .pipe(dest('dist')) //указываем дирректория для записи файла
//   .pipe(browserSync.stream())//получаем все изменения файлов которые будут происходить
// }

const styles = () => {
  return (
    src("src/style/**/*.scss") //получаем ф-лф из папки и ф-лов
      .pipe(
        sass({
          outputStyle: "expanded",
        }).on("error", notify.onError()),
      )
      // .pipe(dest('dist')) //указываем дирректория для записи файла
      .pipe(rename("main.css")) // объединяем полученные файлы в указанный ф-л
      .pipe(
        autoprefixer({
          browsers: ["last 2 versions"], //pipe пишем после объединения тк с одним ф-м работать проще
          cascade: false,
        }),
      )
      .pipe(
        cleanCSS({
          level: 2,
        }),
      )
      .pipe(dest("dist")) //указываем дирректория для записи файла
      .pipe(browserSync.stream())
  ); //получаем все изменения файлов которые будут происходить
};

const stylesDev = () => {
  return (
    src("src/style/**/*.scss") //получаем ф-лф из папки и ф-лов
      .pipe(sourcemaps.init()) //инициализируем sourcemaps
      .pipe(
        sass({
          outputStyle: "expanded",
        }).on("error", notify.onError()),
      )
      // .pipe(dest('dist')) //указываем дирректория для записи файла
      .pipe(rename("main.css")) // объединяем полученные файлы в указанный ф-л
      .pipe(
        autoprefixer({
          browsers: ["last 2 versions"], //pipe пишем после объединения тк с одним ф-м работать проще
          cascade: false,
        }),
      )
      .pipe(sourcemaps.write(".")) //записываем рузельтат sourcemaps
      .pipe(dest("dist")) //указываем дирректория для записи файла
      .pipe(browserSync.stream())
  ); //получаем все изменения файлов которые будут происходить
};

//ф-я svg спрайта
const svgSprites = () => {
  return src("src/img/svg/**/*.svg")
    .pipe(
      svgSprite({
        mode: {
          stack: {
            sprite: "../sprite.svg",
          },
        },
      }),
    )
    .pipe(dest("dist/img"));
};

const scripts = () => {
  return src(["src/js/components/**/*.js", "src/js/main.js"])
    .pipe(
      babel({
        presets: ["@babel/env"],
      }),
    )
    .pipe(concat("app.js"))
    .pipe(uglify().on("error", notify.onError())) //в сулчае ошибки -извещение
    .pipe(dest("dist"))
    .pipe(browserSync.stream()); //автоматическая перехагрузка
};

const scriptsDev = () => {
  return src(["src/js/components/**/*.js", "src/js/main.js"])
    .pipe(sourcemaps.init()) //инициализируем sourcemaps
    .pipe(concat("app.js"))
    .pipe(notify()) //в сулчае ошибки -извещение
    .pipe(sourcemaps.write()) //записываем рузельтат sourcemaps
    .pipe(dest("dist"))
    .pipe(browserSync.stream()); //автоматическая перехагрузка
};

const images = () => {
  return src(
    [
      "src/img/**/*.jpg",
      "src/img/**/*.png",
      "src/img/*.svg", // убрали две звездочки чтобы не было кализий */
      "src/img/**/*.jpeg",
    ],
    {
      encoding: false, //Если false, содержимое файла рассматривается как двоичное. Если это строка, это используется как кодировка текста.
    },
  )
    .pipe(imagen())
    .pipe(dest("dist/img"));
};
const imagesDev = () => {
  return (
    src(
      [
        "src/img/**/*.jpg",
        "src/img/**/*.png",
        "src/img/*.svg", // убрали две звездочки чтобы не было кализий */
        "src/img/**/*.jpeg",
      ],
      {
        encoding: false, //Если false, содержимое файла рассматривается как двоичное. Если это строка, это используется как кодировка текста.
      },
    )
      // .pipe(imagen())
      .pipe(dest("dist/img"))
  );
};

//ф-я просмотра файлов (локальный сервер). она ничего не возвращаяет
const watchFiles = () => {
  browserSync.init({
    //init инциализирует наш сервер
    server: {
      baseDir: "dist",
    },
  });
};

//следим за изменение наших файлов
//первый аргумент за чем следимg
//второй -что будем делать
watch("src/**/*.html", htmlInclude);
// watch('src/**/*.html', htmlDiv)
watch("src/style/**/*.scss", stylesDev);
watch("src/img/svg/**/*.svg", svgSprites);
watch("src/js/**/*.js", scriptsDev);
watch("src/resource/**", resources); //обязательно отстелживаем
watch("src/img/**/*.jpg", imagesDev); //обязательно отстелживаем

//экспорт gulp task, что бы запуускать с помощью gulp  нашу ф-ю
exports.htmlInclude = htmlInclude;
exports.styles = styles;
exports.stylesDev = stylesDev;
exports.scriptsDev = scriptsDev;
exports.scripts = scripts;
exports.htmlDiv = htmlDiv;
exports.htmlMinify = htmlMinify;
exports.watchFiles = watchFiles;
exports.resources = resources;
exports.imagesDev = imagesDev;
exports.default = series(
  cleaner,
  resources,
  htmlInclude,
  scriptsDev,
  stylesDev,
  imagesDev,
  svgSprites,
  watchFiles,
); //рабочий таск в котором перечисляются таски и зап-я
// exports.dev = series(cleaner, resources, htmlDiv, scriptsDev, stylesDev, imagesDev, svgSprites, watchFiles) //старый всего скорее надо удалить таск в котором перечисляются таски и зап-я
exports.build = series(
  cleaner,
  resources,
  htmlIncludeMinify,
  scripts,
  styles,
  images,
  svgSprites,
  watchFiles,
); //окончательный таск в котором перечисляются таски и зап-я
// exports.build = series(cleaner, resources, htmlMinify, scripts, styles, images, svgSprites, watchFiles) //дефолтный таск в котором перечисляются таски и зап-я
