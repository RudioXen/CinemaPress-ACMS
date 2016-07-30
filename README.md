# CinemaPress ACMS
 :movie_camera: Автоматическая система управления сайтом.

 ![Admin panel CinemaPress ACMS](https://raw.githubusercontent.com/CinemaPress/CinemaPress.github.io/master/images/cinemapress-acms/new_admin.png)

## Установка:
- <a href="https://cinemapress.org/pokuraem-domen.html" target="_blank">Как купить домен?</a>
- <a href="https://cinemapress.org/pokupaem-VPS.html" target="_blank">Как купить и подключиться к серверу?</a>

Работает на Debian 7 «Wheezy» (64-bit), Debian 8 «Jessie» (64-bit)
```
~# wget cinemapress.org/i -qO i && chmod +x i && ./i
```

## Обновление:

Обновление **CinemaPress ACMS** до последней версии в репозитории.
```
~# wget cinemapress.org/i -qO i && chmod +x i && ./i 2
```

## Мониторинг работы сайта

**CinemaPress ACMS** использует менеджер процессов ``PM2``, поэтому чтобы отслеживать работоспособность сайта, Вы можете использовать <a href="https://app.keymetrics.io">keymetrics</a>.

- регистрируетесь;
- создаете ``New bucket``;
- получаете ключи;
- соединяетесь с сервером командами:

```
~# pm2 link [secret key] [public key] CinemaPress
~# pm2 install pm2-server-monit
```

<img src="https://raw.githubusercontent.com/CinemaPress/CinemaPress.github.io/master/images/admin/pm2.png" width="600" alt="Мониторинг CinemaPress ACMS"/>

## Распределение нагрузки

Если Ваш сайт стал достаточно посещаемым, то для распределения нагрузки, можно вынести некоторые пакеты на отдельные сервера.

###### Установка CinemaPress ACMS сервера:

```
~# wget cinemapress.org/i -qO i && chmod +x i && ./i 5
```

###### Установка Sphinx сервера:

```
~# wget cinemapress.org/i -qO i && chmod +x i && ./i 6
```

###### Установка Memcached сервера:

```
~# wget cinemapress.org/i -qO i && chmod +x i && ./i 7
```

## Массовая установка/обновление/добавление
Установка нескольких сайтов одной командой поможет сэкономить дорогие минуты простоя сайтов в случае переезда на другой сервер.
```
~# wget cinemapress.org/i -qO i && chmod +x i && ./i 8
```

# CinemaPress DataBase
 :minidisc: База данных ~ **500 000 фильмов/сериалов** (все фильмы/сериалы планеты).

## Импорт:
После успешного запуска и разобравшись с работой в админ-панели **CinemaPress ACMS**, можете [приобрести](https://cinemapress.org/) и импортировать полную базу данных.
```
~# wget cinemapress.org/i -qO i && chmod +x i && ./i 4
```

# CinemaPress Themes

Бесплатные шаблоны оформления, которые Вы можете использовать на своих сайтах. Установка нового шаблона, как и установка ACMS сводится к выполнению одной команды:

```
~# wget cinemapress.org/i -qO i && chmod +x i && ./i 3
```

- [Шаблон «Hodor» для CinemaPress ACMS](https://github.com/CinemaPress/Theme-Hodor)

<a href="https://github.com/CinemaPress/Theme-Hodor"><img src="https://raw.githubusercontent.com/CinemaPress/Theme-Hodor/master/screenshot.png" width="400"></a>

- [Шаблон «Sansa» для CinemaPress ACMS](https://github.com/CinemaPress/Theme-Sansa)

<a href="https://github.com/CinemaPress/Theme-Sansa"><img src="https://raw.githubusercontent.com/CinemaPress/Theme-Sansa/master/screenshot.png" width="400"></a>

- [Шаблон «Robb» для CinemaPress ACMS](https://github.com/CinemaPress/Theme-Robb)

<a href="https://github.com/CinemaPress/Theme-Robb"><img src="https://raw.githubusercontent.com/CinemaPress/Theme-Robb/master/screenshot.png" width="400"></a>

- [Шаблон «Ramsay» для CinemaPress ACMS](https://github.com/CinemaPress/Theme-Ramsay)

<a href="https://github.com/CinemaPress/Theme-Ramsay"><img src="https://raw.githubusercontent.com/CinemaPress/Theme-Ramsay/master/screenshot.png" width="400"></a>

- [Шаблон «Tyrion» для CinemaPress ACMS](https://github.com/CinemaPress/Theme-Tyrion)

<a href="https://github.com/CinemaPress/Theme-Tyrion"><img src="https://raw.githubusercontent.com/CinemaPress/Theme-Tyrion/master/screenshot.png" width="400"></a>

# Параметры CinemaPress ACMS

 ![Image CinemaPress ACMS](https://raw.githubusercontent.com/CinemaPress/CinemaPress.github.io/master/images/cinemapress-acms/forums/icons/publish.png)

Настройка автоматической публикации фильмов. Выбираете число фильмов, которые будут публиковаться на сайте каждый час. Также можно выбрать обязательную информацию у публикуемых фильмов, к примеру чтобы публиковались только фильмы, у которых есть постер, есть русскоязычное название и т.п.

 ![Image CinemaPress ACMS](https://raw.githubusercontent.com/CinemaPress/CinemaPress.github.io/master/images/cinemapress-acms/forums/icons/index.png)

Настройка названия, описания, ключевых слов и списка фильмов, которые будут отображаться на главной странице. Можно создать совершенно уникальную главную страницу, к примеру вывести 5-ть фильмов из категории «комедия», затем 10 фильмов «2016» года, затем последние 5 фильмов из автоматическо-создаваемой коллекции «Выбор редакции», которая содержит только фильмы, у которых написаны уникальные описания и наконец вывести 5 фильмов которые захотите Вы, указав ID фильмов через запятую.

 ![Image CinemaPress ACMS](https://raw.githubusercontent.com/CinemaPress/CinemaPress.github.io/master/images/cinemapress-acms/forums/icons/urls.png)

Настройка URL всех страниц сайта. Указываете как будет выглядеть ЧПУ категорий, фильмов, коллекций, админ-панели и т.д. Например указать чтобы страница со списком фильмов 2016 года имела URL: ``mysite.com/year/2016``, ``mysite.com/god/2016``, можете сделать URL фильмов как у КиноПоиск ``mysite.ru/film/298`` и т.п.

 ![Image CinemaPress ACMS](https://raw.githubusercontent.com/CinemaPress/CinemaPress.github.io/master/images/cinemapress-acms/forums/icons/display.png)

Настройка числа фильмов в каждой категории и сортировка по умолчанию, настройка порога вхождения по числу голосов у фильмов при сортировке по рейтингам, название сортировок.

 ![Image CinemaPress ACMS](https://raw.githubusercontent.com/CinemaPress/CinemaPress.github.io/master/images/cinemapress-acms/forums/icons/movies.png)

Написание уникальных описаний к фильмам. Возможность создать ``<title>`` страницы фильма с такими ключами, которые будете использовать в описании. Предусмотрена массовая вставка описаний (до 1000 шт. за один раз), которые написаны в соответствии с определенным шаблоном - (ID) {Описание} (ID) {Описание} (ID) {Описание} ...

 ![Image CinemaPress ACMS](https://raw.githubusercontent.com/CinemaPress/CinemaPress.github.io/master/images/cinemapress-acms/forums/icons/titles.png)  ![Image CinemaPress ACMS](https://raw.githubusercontent.com/CinemaPress/CinemaPress.github.io/master/images/cinemapress-acms/forums/icons/descriptions.png)  ![Image CinemaPress ACMS](https://raw.githubusercontent.com/CinemaPress/CinemaPress.github.io/master/images/cinemapress-acms/forums/icons/keywords.png)

Написание названий, описаний и ключевых слов для категорий (жанр, жанры, год, годы и т.д.) и страниц фильма (онлайн, скачать и т.д.);

 ![Image CinemaPress ACMS](https://raw.githubusercontent.com/CinemaPress/CinemaPress.github.io/master/images/cinemapress-acms/forums/icons/codes.png)

Вставка пользовательского кода в страницы сайта и написание условий для robots.txt. Например для подтверждение владением сайта, рекламные коды, коды статистики и т.д.

 ![Image CinemaPress ACMS](https://raw.githubusercontent.com/CinemaPress/CinemaPress.github.io/master/images/cinemapress-acms/forums/icons/load.png)

Настройка адреса сервера Sphinx, Memcached и статических файлов. К примеру после достижения сайта успехов в посещаемости, кэширующий сервер можно вынести на отдельный сервер и указать адрес этого сервера в параметре Memcached.

 ![Image CinemaPress ACMS](https://raw.githubusercontent.com/CinemaPress/CinemaPress.github.io/master/images/cinemapress-acms/forums/icons/cache.png)

Настройка времени кэширования страниц сайта для того, чтобы снизить нагрузку на сайт. Также Вы можете собственноручно при внесении определенных изменений в параметрах или шаблоне, очищать кэш, чтобы эти изменения были видны на сайте.

# Модули CinemaPress ACMS

 ![Image CinemaPress ACMS](https://raw.githubusercontent.com/CinemaPress/CinemaPress.github.io/master/images/cinemapress-acms/forums/icons/soon.png)

Модуль блока, в котором будут фильмы, премьеры которых скоро состоятся в кинотеатрах. Данный параметр рекомендуется к активации после нескольких месяцев работы сайта, чтобы диапазон был в районе ID 900 000.

 ![Image CinemaPress ACMS](https://raw.githubusercontent.com/CinemaPress/CinemaPress.github.io/master/images/cinemapress-acms/forums/icons/comments.png)

Модуль добавления на страницу фильма блока с отправкой комментариев. Это могут быть как виджеты от ВК, Facebook, так и сервис комментариев Disqus. Можно активировать все сразу, чтобы у пользователя был выбор, в каком сервисе оставить комментарий.

 ![Image CinemaPress ACMS](https://raw.githubusercontent.com/CinemaPress/CinemaPress.github.io/master/images/cinemapress-acms/forums/icons/related.png)

Модуль связанных фильмов - это блок или блоки с фильмами на странице фильма, которые отображаются ниже плеера. Это фильмы из такого же года/жанра/страны/режиссера/актера что и оригинальный фильм. 

 ![Image CinemaPress ACMS](https://raw.githubusercontent.com/CinemaPress/CinemaPress.github.io/master/images/cinemapress-acms/forums/icons/collections.png)

Модуль коллекций с фильмами для создания уникальных списков фильмов, которые будут интересны зрителю. Есть коллекция, которая формируется автоматически на основе фильмов, для которых написаны уникальные описания, она называется «Выбор редакции».

 ![Image CinemaPress ACMS](https://raw.githubusercontent.com/CinemaPress/CinemaPress.github.io/master/images/cinemapress-acms/forums/icons/slider.png)

Модуль слайдера с фильмами, позволяет добавить на сайте блок со слайдером (каруселью). Фильмы в слайдере должны быть максимально интересны зрителю, так как именно этот блок будет бросаться в глаза в первую очередь всем посетителям.

 ![Image CinemaPress ACMS](https://raw.githubusercontent.com/CinemaPress/CinemaPress.github.io/master/images/cinemapress-acms/forums/icons/abuse.png)

Модуль скрытия фильмов, на которые поступили жалобы от правообладателя или просто для которых следует скрыть возможность смотреть онлайн или скачивать.

 ![Image CinemaPress ACMS](https://raw.githubusercontent.com/CinemaPress/CinemaPress.github.io/master/images/cinemapress-acms/forums/icons/top.png)

Модуль блока с фильмами который отображается в каждой категории и содержит ТОП нескольких фильмов этой категории.

 ![Image CinemaPress ACMS](https://raw.githubusercontent.com/CinemaPress/CinemaPress.github.io/master/images/cinemapress-acms/forums/icons/socseti.png)

Модуль оповещения поисковых систем и пользователей сайта о том, что у сайта теперь есть паблик/страница с соц. сетях.

 ![Image CinemaPress ACMS](https://raw.githubusercontent.com/CinemaPress/CinemaPress.github.io/master/images/cinemapress-acms/forums/icons/schema.png)

Модуль микроразметки сайта позволяет включить на сайте разметку по стандарту schema.org

 ![Image CinemaPress ACMS](https://raw.githubusercontent.com/CinemaPress/CinemaPress.github.io/master/images/cinemapress-acms/forums/icons/continue.png)

Модуль позволяет пользователю сразу перейти на страницу фильма, на которой он не досмотрел его до конца.

 ![Image CinemaPress ACMS](https://raw.githubusercontent.com/CinemaPress/CinemaPress.github.io/master/images/cinemapress-acms/forums/icons/viewed.png)

Модуль отображает внизу страницы список последних фильмов, которые посещал пользователь за месяц.

 ![Image CinemaPress ACMS](https://raw.githubusercontent.com/CinemaPress/CinemaPress.github.io/master/images/cinemapress-acms/forums/icons/player.png)

Модуль настройки кнопок голосования в плеере «нравится»/«не нравится».

 ![Image CinemaPress ACMS](https://raw.githubusercontent.com/CinemaPress/CinemaPress.github.io/master/images/cinemapress-acms/forums/icons/blocking.png)

Модуль блокировки плеера и возможности скачивания до момента, пока пользователь не совершит какое-либо действие:
- Поделится страницей в соц. сети;
- Купит ключ для активации платной подписки;
- Просмотрит рекламу в плеере несколько секунд;
- Ограничения для пользователей использующие AdBlock.

# Использование CinemaPress ACMS

CinemaPress ACMS распространяется под ![MIT лицензией](https://github.com/CinemaPress/CinemaPress-ACMS/blob/master/LICENSE.txt).

Copyright (c) 2016 CinemaPress ACMS