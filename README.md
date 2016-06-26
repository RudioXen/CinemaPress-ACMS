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

Обновление **CinemaPress CMS** до последней версии в репозитории.
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

###### Установка CinemaPress CMS сервера:

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

Бесплатные шаблоны оформления, которые Вы можете использовать на своих сайтах. Установка нового шаблона, как и установка ACMS сводится к выполнению одной команды.

- [Шаблон «Hodor» для CinemaPress ACMS (kinokong.net)](https://github.com/CinemaPress/Theme-Hodor)
```
~# wget cinemapress.org/i -qO i && chmod +x i && ./i 3
```
<a href="https://github.com/CinemaPress/Theme-Hodor"><img src="https://raw.githubusercontent.com/CinemaPress/Theme-Hodor/master/screenshot.png" width="400"></a>