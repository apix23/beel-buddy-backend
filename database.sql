DROP TABLE if EXISTS public.administrators;

CREATE TABLE administrators (
	id serial NOT NULL,
	"name" varchar(50) NOT NULL,
	email varchar(40) NOT NULL,
	"password" varchar(40) NOT NULL,
	CONSTRAINT administrators_pkey PRIMARY KEY (id)
);


DROP TABLE  if EXISTS public.buddies;

CREATE TABLE buddies (
	id serial NOT NULL,
	"name" varchar(50) NOT NULL,
	dateofbirth date NOT NULL,
	email varchar(40) NOT NULL,
	hometown varchar(30) NOT NULL,
	hobbiesandinterests text NOT NULL,
	im_a_buddy INT NOT NULL,
	joined_at date NOT NULL,
	CONSTRAINT buddies_pkey PRIMARY KEY (id)
);


DROP TABLE if EXISTS public.patients;

CREATE TABLE public.patients (
	id serial NOT NULL,
	"name" varchar(50) NOT NULL,
	dateofbirth date NOT NULL,
	email varchar(40) NOT NULL,
	hometown varchar(30) NOT NULL,
	hobbiesandinterests text NOT NULL,
	im_a_buddy INT NOT NULL,
	joined_at date NOT NULL,
	CONSTRAINT patients_pkey PRIMARY KEY (id)
);



DROP table if EXISTS matches;

CREATE TABLE matches (
	id serial NOT NULL,
	patient_id int4 NOT NULL,
	buddyid int4 NOT NULL,
	admin_id int4 NOT NULL,
	start_date_of_match date NOT NULL,
	end_date_of_match date NULL,
	"comments" varchar(50) NULL,
	ending_reason text NULL,
	
	CONSTRAINT matches_pkey PRIMARY KEY (id),
	CONSTRAINT fk_adminid FOREIGN KEY (admin_id) REFERENCES administrators(id),
	CONSTRAINT fk_buddyid FOREIGN KEY (buddyid) REFERENCES buddies(id),
	CONSTRAINT fk_patientid FOREIGN KEY (patient_id) REFERENCES patients(id)
);


/* inserting elements*/

INSERT INTO buddies ("name",dateofbirth,email,hometown,hobbiesandinterests, im_a_buddy, joined_at) VALUES ('Antony Leans', '1993-02-23','leantony@thonet.uk','Amsterdam','travel',1, '2020-09-13');


INSERT INTO buddies ("name",dateofbirth,email,hometown,hobbiesandinterests, im_a_buddy, joined_at) VALUES ('Jhon Clavan', '1994-01-26','jhon@thonet.es','Ultrecht','eat pizza',1, '2020-09-13');


INSERT INTO buddies ("name",dateofbirth,email,hometown,hobbiesandinterests, im_a_buddy, joined_at) VALUES ('Annika Van Hommel', '1988-10-13','Annika@thonet.uk','Amsterdam','running',1, '2020-09-13');


INSERT INTO buddies ("name",dateofbirth,email,hometown,hobbiesandinterests, im_a_buddy, joined_at) VALUES ('Diane Sturgles', '1993-02-23','DianeSt@thonet.uk','Amsterdam','travel',1, '2020-09-13');


INSERT INTO buddies ("name",dateofbirth,email,hometown,hobbiesandinterests, im_a_buddy, joined_at) VALUES ('Vincent Van Grondelle', '1992-12-13','vincent@thonet.uk','Ultrecht','travel',1, '2020-09-13');

INSERT INTO buddies ("name",dateofbirth,email,hometown,hobbiesandinterests, im_a_buddy, joined_at) VALUES ('Hanna Lunne', '1988-01-30','hannaLun@thonet.uk','Amsterdam','walk',1, '2020-09-13');

/*Patients*/


INSERT INTO patients ("name",dateofbirth,email,hometown,hobbiesandinterests, im_a_buddy, joined_at) VALUES ('Veronica Alinafe', '1970-01-03','leantony@thonet.uk','Amsterdam','travel',0, '2020-09-13');


INSERT INTO patients ("name",dateofbirth,email,hometown,hobbiesandinterests, im_a_buddy, joined_at) VALUES ('Erick Ford', '1985-05-26','erick@thonet.es','Ultrecht','play the piano',0, '2020-09-13');


INSERT INTO patients ("name",dateofbirth,email,hometown,hobbiesandinterests, im_a_buddy, joined_at) VALUES ('Marcelo Dongobud', '1988-10-13','MarceloGon@thonet.uk','Amsterdam','running',0, '2020-09-13');


INSERT INTO patients ("name",dateofbirth,email,hometown,hobbiesandinterests, im_a_buddy, joined_at) VALUES ('Frank Gole', '1984-11-21','frank@thonet.uk','Amsterdam','play guitar',0, '2020-09-13');


INSERT INTO patients ("name",dateofbirth,email,hometown,hobbiesandinterests, im_a_buddy, joined_at) VALUES ('Marie Tonelli', '1994-11-03','marie@thonet.uk','Ultrecht','painting',0, '2020-09-13');


/*This portion is to update the tables so that they have a enabled field*/

alter table buddies 
add column enabled int;

update buddies set enabled = 1;

alter table patients 
add column enabled int;

update patients set enabled = 1;

alter table buddies alter column enabled set not null;
alter table patients alter column enabled set not null;