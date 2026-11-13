-- Host library and playable boards. A board copies clues at creation time
-- so later library edits do not change a game already in progress.

create table if not exists categories (
  id serial primary key,
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists clues (
  id serial primary key,
  category_id integer not null references categories(id) on delete cascade,
  value integer not null check (value in (100, 200, 300, 400, 500)),
  answer text not null default '',
  question text not null default '',
  unique (category_id, value)
);

create table if not exists finals (
  id serial primary key,
  category text not null,
  answer text not null,
  question text not null,
  created_at timestamptz not null default now()
);

create table if not exists games (
  id serial primary key,
  title text not null,
  final_category text not null,
  final_answer text not null,
  final_question text not null,
  final_played boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists game_clues (
  game_id integer not null references games(id) on delete cascade,
  position integer not null check (position between 0 and 5),
  category_name text not null,
  value integer not null check (value in (100, 200, 300, 400, 500)),
  answer text not null,
  question text not null,
  primary key (game_id, position, value)
);

create table if not exists played_clues (
  game_id integer not null references games(id) on delete cascade,
  position integer not null check (position between 0 and 5),
  value integer not null check (value in (100, 200, 300, 400, 500)),
  primary key (game_id, position, value)
);

create table if not exists contestants (
  id serial primary key,
  game_id integer not null references games(id) on delete cascade,
  slot integer not null check (slot between 0 and 2),
  score integer not null default 0,
  unique (game_id, slot)
);

insert into categories (name) values
  ('Yomim Tovim'),
  ('39 Melachos'),
  ('People in Tanach'),
  ('Berachos'),
  ('Mitzvos & Halachah'),
  ('Jewish Numbers');

insert into clues (category_id, value, answer, question)
select c.id, s.value, s.answer, s.question
from (
  values
    ('Yomim Tovim', 100, 'This eight-day holiday celebrates the miracle of a small cruse of oil lasting eight days', 'What is Chanukah?'),
    ('Yomim Tovim', 200, 'On this holiday, we eat apples dipped in honey and hear the blowing of the shofar', 'What is Rosh Hashanah?'),
    ('Yomim Tovim', 300, 'During this seven-day harvest festival, meals are eaten in temporary outdoor huts', 'What is Sukkos?'),
    ('Yomim Tovim', 400, 'The four mitzvos of this holiday include reading the Megillah and giving Mishloach Manos', 'What is Purim?'),
    ('Yomim Tovim', 500, 'This holiday, falling seven weeks after the second day of Pesach, commemorates the giving of the Torah', 'What is Shavuos?'),
    ('39 Melachos', 100, 'Kindling a flame or turning on an incandescent light violates this melachah', 'What is Mav''ir?'),
    ('39 Melachos', 200, 'Separating chaff from wheat—or picking bad pieces out of good food—falls under this melachah', 'What is Borer?'),
    ('39 Melachos', 300, 'Carrying an object from a private domain to a public domain is prohibited under this melachah', 'What is Hotza''ah?'),
    ('39 Melachos', 400, 'Tying a permanent, double knot is forbidden under this melachah', 'What is Kosher?'),
    ('39 Melachos', 500, 'This melachah, meaning smoothing, prohibits applying creams, ointments, or thick spreads evenly', 'What is Memacheik?'),
    ('People in Tanach', 100, 'This prophet led Bnei Yisrael out of Mitzrayim and received the Torah on Har Sinai', 'Who is Moshe Rabbeinu?'),
    ('People in Tanach', 200, 'Before becoming king of Israel, this shepherd defeated the giant Golias with a slingshot', 'Who is Dovid HaMelech?'),
    ('People in Tanach', 300, 'This queen risked her life by approaching King Achashveirosh uninvited to save the Jewish people', 'Who is Esther HaMalkah?'),
    ('People in Tanach', 400, 'Known for his wisdom, this son of Dovid built the first Beis HaMikdash in Yerushalayim', 'Who is Shlomo HaMelech?'),
    ('People in Tanach', 500, 'This prophet was swallowed by a giant fish after attempting to flee Hashem''s mission to Nineveh', 'Who is Yonah?'),
    ('Berachos', 100, 'This berachah ending in "HaMotzi Lechem Min HaAretz" is recited before eating bread', 'What is HaMotzi?'),
    ('Berachos', 200, 'Foods made from the five grains—such as cake, cookies, and pasta—require this berachah', 'What is Borei Minei Mezonos?'),
    ('Berachos', 300, 'This catch-all berachah is recited on water, meat, fish, eggs, and dairy products', 'What is Shehakol Nihiyah Bidvaro?'),
    ('Berachos', 400, 'Grapes, figs, pomegranates, olives, and dates are followed by this special concluding berachah', 'What is Al HaEitz?'),
    ('Berachos', 500, 'Recited upon seeing lightning, shooting stars, or majestic mountains, this berachah praises Hashem as the Maker of Creation', 'What is Oseh Ma''aseh Bereishis?'),
    ('Mitzvos & Halachah', 100, 'This scroll containing the Shema is affixed to the right doorpost of Jewish homes', 'What is a mezuzah?'),
    ('Mitzvos & Halachah', 200, 'Ten adult Jewish men are required to form this prayer quorum', 'What is a minyan?'),
    ('Mitzvos & Halachah', 300, 'These black leather boxes containing Torah scrolls are worn on the arm and head during weekday morning prayers', 'What are tefillin?'),
    ('Mitzvos & Halachah', 400, 'This braided candle, wine, and fragrant spices are used in the ceremony marking the end of Shabbos', 'What is Havdalah?'),
    ('Mitzvos & Halachah', 500, 'This Hebrew term refers to the requirement of waiting between eating meat and dairy', 'What is basar b''chalav?'),
    ('Jewish Numbers', 100, 'This is the number of tribes of Israel descended from Yaakov''s sons', 'What is 12?'),
    ('Jewish Numbers', 200, 'According to tradition, there are this total number of mitzvos in the Torah', 'What is 613?'),
    ('Jewish Numbers', 300, 'This is the number of plagues Hashem brought upon Mitzrayim before the Exodus', 'What is 10?'),
    ('Jewish Numbers', 400, 'This many days make up the counting period of Sefiras HaOmer between Pesach and Shavuos', 'What is 49?'),
    ('Jewish Numbers', 500, 'This is the total number of tractates (Masechtos) in the Mishnah', 'What is 63?')
) as s(name, value, answer, question)
join categories c on c.name = s.name;

insert into finals (category, answer, question) values
  (
    'People in Tanach',
    'He rebeled againstRechovom Ben Shlomo, becoming the first king of the Ten Tribes',
    'Who was Yaravam ben Nevat?'
  );

insert into games (title, final_category, final_answer, final_question)
select 'Opening Night', category, answer, question
from finals
where category = 'Inventions'
order by id
limit 1;

insert into game_clues (game_id, position, category_name, value, answer, question)
select g.id, p.position, c.name, cl.value, cl.answer, cl.question
from games g
join (
  values
    ('Yomim Tovim', 1),
  ('39 Melachos', 2),
  ('People in Tanach', 3),
  ('Berachos', 4),
  ('Mitzvos & Halachah', 5),
  ('Jewish Numbers', 6)
) as p(name, position) on true
join categories c on c.name = p.name
join clues cl on cl.category_id = c.id
where g.title = 'Opening Night';

insert into contestants (game_id, slot, score)
select g.id, s.slot, 0
from games g
cross join (values (0), (1), (2)) as s(slot)
where g.title = 'Opening Night';
