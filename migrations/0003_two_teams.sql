-- Keep the first two scores on existing boards and retire the third slot.
delete from contestants where slot = 2;
alter table contestants rename to teams;
alter table teams drop constraint contestants_slot_check;
alter table teams add constraint teams_slot_check check (slot between 0 and 1);

-- Team names are shared settings, while each board keeps its own scores.
create table team_names (
  slot integer primary key check (slot between 0 and 1),
  name text not null check (length(trim(name)) between 1 and 40)
);

insert into team_names (slot, name) values (0, 'Team 1'), (1, 'Team 2');
