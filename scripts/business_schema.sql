create table businesses (
	id bigserial primary key not null,
	created_at timestamp default now(),
	updated_at timestamp default now()
);

create index on businesses(created_at);

create table ledgers (
	id bigserial primary key not null,
	business_id bigserial not null references businesses(id),
	invoice_id bigserial not null,
	amount numeric(15,2),
	currency varchar(3),
	"type" varchar(50),
	payment_date date,
	created_at timestamp default now(),
	updated_at timestamp default now()
);

create index on ledgers(created_at);
create index on ledgers(payment_date);
create index on ledgers(business_id, payment_date);
create index on ledgers(business_id);
create index on ledgers(invoice_id);
create index on ledgers(business_id, invoice_id);

create table business_networks(
	business_id bigserial not null references businesses(id),
	business_relation_id bigserial not null references businesses(id),
	reporting_date date not null,
	issued_invoices bigint not null default 0,
	received_invoices bigint not null default 0,
	created_at timestamp default now(),
	updated_at timestamp default now(),
	primary key (business_id, business_relation_id, reporting_date)
);

create index on business_networks(created_at);
create index on business_networks(business_id);
create index on business_networks(business_relation_id);
create index on business_networks(reporting_date);
