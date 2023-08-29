drop table if exists paste_list;
create table paste_list (
id serial primary key,
  title varchar (50),
  description varchar (1000) not null,
  posted_time timestamp default current_timestamp
);

insert into paste_list (title, description)
values ('First title', 'First body'),
('Second title', 'second body'),
('trird title', 'third body');