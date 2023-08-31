drop table if exists paste_list;
create table paste_list (
id serial primary key,
  title varchar (50),
  description varchar (20000) not null,
  posted_time timestamp default current_timestamp
);

insert into paste_list (title, description)
values ('First title', 'First body'),
('Second title', 'second body'),
('third title', 'third body');

create table all_comments (
	id serial primary key,
  paste_id integer references paste_list(id), 
  comment varchar(20000)
);