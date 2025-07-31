--
-- PostgreSQL database dump
--

-- Dumped from database version 16.9
-- Dumped by pg_dump version 16.9

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: customer_applications; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.customer_applications (
    id integer NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    submitted_at timestamp without time zone DEFAULT now(),
    reviewed_at timestamp without time zone,
    reviewed_by text,
    admin_notes text,
    borrower_first_name text NOT NULL,
    borrower_last_name text NOT NULL,
    borrower_email text NOT NULL,
    borrower_phone text NOT NULL,
    borrower_dob date,
    borrower_ssn text,
    street_address text,
    city text,
    state text,
    country text DEFAULT 'United States'::text,
    postal_code text,
    prior_address text,
    living_situation text,
    residence_duration text,
    monthly_payment integer,
    employer text,
    years_employed text,
    employer_phone text,
    monthly_gross_income integer,
    bank_name text,
    account_type text,
    co_borrower_first_name text,
    co_borrower_last_name text,
    co_borrower_email text,
    co_borrower_phone text,
    co_borrower_dob date,
    co_borrower_ssn text,
    notes text,
    consent_to_sms boolean DEFAULT false,
    borrower_signature text,
    co_borrower_signature text,
    referral_source text,
    interested_vehicle_id integer
);


ALTER TABLE public.customer_applications OWNER TO neondb_owner;

--
-- Name: customer_applications_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.customer_applications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.customer_applications_id_seq OWNER TO neondb_owner;

--
-- Name: customer_applications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.customer_applications_id_seq OWNED BY public.customer_applications.id;


--
-- Name: inquiries; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.inquiries (
    id integer NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    email text NOT NULL,
    phone text,
    vehicle_id integer,
    message text,
    created_at text NOT NULL
);


ALTER TABLE public.inquiries OWNER TO neondb_owner;

--
-- Name: inquiries_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.inquiries_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.inquiries_id_seq OWNER TO neondb_owner;

--
-- Name: inquiries_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.inquiries_id_seq OWNED BY public.inquiries.id;


--
-- Name: vehicles; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.vehicles (
    id integer NOT NULL,
    slug text NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    price integer NOT NULL,
    status text NOT NULL,
    mileage text NOT NULL,
    year text NOT NULL,
    make text NOT NULL,
    model text NOT NULL,
    engine text NOT NULL,
    transmission text NOT NULL,
    drive_type text NOT NULL,
    exterior_color text NOT NULL,
    interior_color text NOT NULL,
    images text[] NOT NULL,
    key_features text[] NOT NULL,
    meta_title text NOT NULL,
    meta_description text NOT NULL,
    carfax_embed_code text,
    vin text,
    stock_number text,
    notes text,
    last_synced_at text,
    autocheck_url text,
    vehicle_history_score integer,
    accident_history integer DEFAULT 0,
    previous_owners integer DEFAULT 0,
    service_records integer DEFAULT 0,
    title_status text DEFAULT 'unknown'::text,
    last_history_update text,
    banner_reduced boolean DEFAULT false,
    banner_sold boolean DEFAULT false,
    banner_great_deal boolean DEFAULT false,
    banner_new boolean DEFAULT false,
    created_at text DEFAULT '2025-07-24T03:43:40.497Z'::text
);


ALTER TABLE public.vehicles OWNER TO neondb_owner;

--
-- Name: vehicles_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.vehicles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.vehicles_id_seq OWNER TO neondb_owner;

--
-- Name: vehicles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.vehicles_id_seq OWNED BY public.vehicles.id;


--
-- Name: customer_applications id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.customer_applications ALTER COLUMN id SET DEFAULT nextval('public.customer_applications_id_seq'::regclass);


--
-- Name: inquiries id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.inquiries ALTER COLUMN id SET DEFAULT nextval('public.inquiries_id_seq'::regclass);


--
-- Name: vehicles id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.vehicles ALTER COLUMN id SET DEFAULT nextval('public.vehicles_id_seq'::regclass);


--
-- Data for Name: customer_applications; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.customer_applications (id, status, submitted_at, reviewed_at, reviewed_by, admin_notes, borrower_first_name, borrower_last_name, borrower_email, borrower_phone, borrower_dob, borrower_ssn, street_address, city, state, country, postal_code, prior_address, living_situation, residence_duration, monthly_payment, employer, years_employed, employer_phone, monthly_gross_income, bank_name, account_type, co_borrower_first_name, co_borrower_last_name, co_borrower_email, co_borrower_phone, co_borrower_dob, co_borrower_ssn, notes, consent_to_sms, borrower_signature, co_borrower_signature, referral_source, interested_vehicle_id) FROM stdin;
1	approved	2025-07-24 05:20:19.756009	2025-07-24 05:20:25.138	Admin	Excellent credit history and stable employment. Approved for financing.	John	Doe	john.doe@example.com	765-555-0123	1985-05-15	\N	123 Main St	Richmond	IN	United States	47374	\N	rent	\N	120000	ABC Company	3	\N	450000	First National Bank	checking	\N	\N	\N	\N	\N	\N	Looking for reliable transportation for work commute	t	\N	\N	\N	\N
\.


--
-- Data for Name: inquiries; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.inquiries (id, first_name, last_name, email, phone, vehicle_id, message, created_at) FROM stdin;
\.


--
-- Data for Name: vehicles; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.vehicles (id, slug, title, description, price, status, mileage, year, make, model, engine, transmission, drive_type, exterior_color, interior_color, images, key_features, meta_title, meta_description, carfax_embed_code, vin, stock_number, notes, last_synced_at, autocheck_url, vehicle_history_score, accident_history, previous_owners, service_records, title_status, last_history_update, banner_reduced, banner_sold, banner_great_deal, banner_new, created_at) FROM stdin;
58	2018-subaru-crosstrek-1070	2018 SUBARU CROSSTREK	Subaru Crosstrek in excellent condition	18999	for-sale	110,428 miles	2018	SUBARU	CROSSTREK	Not specified	Not specified	Not specified	GREY	BLACK/GREY	{}	{}	2018 SUBARU CROSSTREK - T-Rex Motors Richmond, IN	2018 SUBARU CROSSTREK for sale at T-Rex Motors. Contact us at 765-238-2887.	<a href='http://www.carfax.com/VehicleHistory/p/Report.cfx?partner=DVW_1&vin=JF2GTAJC0JH207352'><img src='http://www.carfaxonline.com/assets/subscriber/carfax_free_button.gif' width='120' height='49' border='0'></a>	JF2GTAJC0JH207352	1070	\N	\N	\N	\N	0	0	0	unknown	\N	f	f	f	f	2025-07-24T03:43:40.497Z
41	2014-chevrolet-cruze-1052	2014 Chevrolet Cruze	one touch windows, folding side/driver mirror, cruise, 12v power outlet	9999	for-sale	103,903 miles	2014	Chevrolet	Cruze	Not specified	Not specified	Not specified	DARK GREEN	Tan	{https://lh3.googleusercontent.com/d/14nKcHrwgfPzk34H7WReO20nNZgbPDXoO=w800,https://lh3.googleusercontent.com/d/1V1YvrqpskSHa7Fb19gGfWoLjPf9mpn_4=w800,https://lh3.googleusercontent.com/d/1taYD4NiJHehVqH2yOvDncfxhXyWPUtMM=w800,https://lh3.googleusercontent.com/d/13nj6gsMpG8Q0gUJcEOinJnlc67qPljkd=w800,https://lh3.googleusercontent.com/d/1wlWne8TCQQABPkySaDIKNMv6Jc6PXZxG=w800,https://lh3.googleusercontent.com/d/1ZViAX4rgbt3nbLH_OmyGM2Zg6cKcHCfU=w800}	{}	2014 Chevrolet Cruze - T-Rex Motors Richmond, IN	2014 Chevrolet Cruze for sale at T-Rex Motors. Contact us at 765-238-2887.	<a href='http://www.carfax.com/VehicleHistory/p/Report.cfx?partner=DVW_1&vin=1G1PB5SG7E7352046'><img src='http://www.carfaxonline.com/assets/subscriber/carfax_free_button.gif' width='120' height='49' border='0'></a>	1G1PB5SG7E7352046	1052	\N	\N	\N	\N	0	0	0	unknown	\N	f	f	f	f	2025-07-24T03:43:40.497Z
45	2020-dodge-charger-1021	2020 Dodge Charger	Backup Camera; Cloth Seats; Remote Start; Dual A/C Zones;	17999	for-sale	96,627 miles	2020	Dodge	Charger	Not specified	Not specified	Not specified	White	Black	{}	{}	2020 Dodge Charger - T-Rex Motors Richmond, IN	2020 Dodge Charger for sale at T-Rex Motors. Contact us at 765-238-2887.	<a href='http://www.carfax.com/VehicleHistory/p/Report.cfx?partner=DVW_1&vin=2C3CDXBG7LH119687'><img src='http://www.carfaxonline.com/assets/subscriber/carfax_free_button.gif' width='120' height='49' border='0'></a>	2C3CDXBG7LH119687	1021	\N	\N	\N	\N	0	0	0	unknown	\N	f	f	f	f	2025-07-24T03:43:40.497Z
48	2015-toyota-corolla-1041	2015 Toyota Corolla	back up camera, power windows, power locks, cruise control, cd player, cloth seats	13999	for-sale	74,684 miles	2015	Toyota	Corolla	Not specified	Not specified	Not specified	Silver	Gray	{}	{}	2015 Toyota Corolla - T-Rex Motors Richmond, IN	2015 Toyota Corolla for sale at T-Rex Motors. Contact us at 765-238-2887.	<a href='http://www.carfax.com/VehicleHistory/p/Report.cfx?partner=DVW_1&vin=2T1BURHE3FC436454'><img src='http://www.carfaxonline.com/assets/subscriber/carfax_free_button.gif' width='120' height='49' border='0'></a>	2T1BURHE3FC436454	1041	\N	\N	\N	\N	0	0	0	unknown	\N	f	f	f	f	2025-07-24T03:43:40.497Z
43	2019-chevrolet-traverse-1055	2019 CHEVROLET TRAVERSE	Backup Camera; Cloth Seats; Heated Passenger Seat; Heated Driver	19999	for-sale	94,186 miles	2019	CHEVROLET	TRAVERSE	Not specified	Not specified	Not specified	GRAY	black	{https://lh3.googleusercontent.com/d/1y-UBx90V15x2P0vIqTUOk85s9ZF9Z5TC=w800,https://lh3.googleusercontent.com/d/1p-Wc7qGPZCl6AChaSKehcQu4-_nw75BT=w800,https://lh3.googleusercontent.com/d/1dy8K-aqnXB6qvhcVszmtKqDtm3DtnrDR=w800,https://lh3.googleusercontent.com/d/123CwYsiUU-2Okd8un0AvAzJxaxqeoCsI=w800,https://lh3.googleusercontent.com/d/1dTmTEFiFiTynh6fuxBQfcg49RYkmvEji=w800}	{}	2019 CHEVROLET TRAVERSE - T-Rex Motors Richmond, IN	2019 CHEVROLET TRAVERSE for sale at T-Rex Motors. Contact us at 765-238-2887.	<a href='http://www.carfax.com/VehicleHistory/p/Report.cfx?partner=DVW_1&vin=1GNEVGKW9KJ260256'><img src='http://www.carfaxonline.com/assets/subscriber/carfax_free_button.gif' width='120' height='49' border='0'></a>	1GNEVGKW9KJ260256	1055	\N	\N	\N	\N	0	0	0	unknown	\N	f	f	f	f	2025-07-24T03:43:40.497Z
55	2020-kia-forte-1061	2020 KIA FORTE	Backup Camera; Cloth Seats; Daytime Running Lights; Touch Screen	17999	for-sale	52,972 miles	2020	KIA	FORTE	Not specified	Not specified	Not specified	WHITE	Not specified	{https://lh3.googleusercontent.com/d/1F1T1SWydciTX-ZyCBmlGfaHFwTHkCiVj=w800,https://lh3.googleusercontent.com/d/1CUz0uNFVbSvTyQ2YM-cnLG42a5sIZpqq=w800,https://lh3.googleusercontent.com/d/1RyzOC_RC_N_XvhMINM06CaLe-WFMPaRk=w800,https://lh3.googleusercontent.com/d/19Rxm57SJeqj2Wcsu0AAF70oVOkcqVrEs=w800,https://lh3.googleusercontent.com/d/1VVVPL34qaPHh5IlkKGZdt3pD0uNehurC=w800,https://lh3.googleusercontent.com/d/1t3lbaH1qp8b-P_7GTI1_nb1dcUGYJZOy=w800}	{}	2020 KIA FORTE - T-Rex Motors Richmond, IN	2020 KIA FORTE for sale at T-Rex Motors. Contact us at 765-238-2887.	<a href='http://www.carfax.com/VehicleHistory/p/Report.cfx?partner=DVW_1&vin=3KPF24ADXLE140629'><img src='http://www.carfaxonline.com/assets/subscriber/carfax_free_button.gif' width='120' height='49' border='0'></a>	3KPF24ADXLE140629	1061	\N	\N	\N	\N	0	0	0	unknown	\N	f	f	f	f	2025-07-24T03:43:40.497Z
52	2019-dodge-journey-1050	2019 Dodge Journey	Backup Camera; Cloth Seats; Dual A/C Zones; Front Fog Lights; Daytime	13499	for-sale	80,889 miles	2019	Dodge	Journey	Not specified	Not specified	Not specified	Black	Black	{https://lh3.googleusercontent.com/d/1V4nhuQbD7DI63tvpYnKd-7jmeKcy3GUf=w800,https://lh3.googleusercontent.com/d/1FgKgW8i1131giPWyIfGmzVs8gCQClhub=w800,https://lh3.googleusercontent.com/d/1lVcvkONpWBzKz31dzrrU2addN2Il6LCx=w800,https://lh3.googleusercontent.com/d/14-16b90_I8SFEveNejqz0tG6nI8hYn1x=w800,https://lh3.googleusercontent.com/d/1TPdtNEV047jXuWekWKLu2sOcI29dzxbG=w800,https://lh3.googleusercontent.com/d/13A1MbNCTGDdmlHirY-5U6iOPaarqWWUE=w800,https://lh3.googleusercontent.com/d/1j7r4E5Ofq2UV1DEeR2nb4KMEfzINPu1p=w800,https://lh3.googleusercontent.com/d/1snl9tIkQy9xVfC9LLcgXdJMSqMdhZPS2=w800,https://lh3.googleusercontent.com/d/1oCrC_Tj9bGZPzcEQl4GZTiNNyo26gEaf=w800,https://lh3.googleusercontent.com/d/1E41HU3j-BAQWrp5FRYl5co9JcuocfBb6=w800,https://lh3.googleusercontent.com/d/10G8jCydAIduxztWLeVOIL1QY0uAfXWNw=w800,https://lh3.googleusercontent.com/d/1H2o6TI_4Ntj2CUatUKcsdECGtwdM2HuJ=w800,https://lh3.googleusercontent.com/d/15xPfMylaYUMWmJWapzoPELJ8p3XJEpbm=w800,https://lh3.googleusercontent.com/d/1apbCnv9WgL0b8P--cRaljYIlAJw9G_3G=w800,https://lh3.googleusercontent.com/d/1NAYisXvvGEkdRJRIQuHCFdQqIaEdecc9=w800,https://lh3.googleusercontent.com/d/1UiZ-OcoZnDXuYg-jvvpSPnhsHT6ZPMtA=w800,https://lh3.googleusercontent.com/d/1SMfSjTOwQ8QHidC-c_tmYnfHEhKhBWHd=w800}	{}	2019 Dodge Journey - T-Rex Motors Richmond, IN	2019 Dodge Journey for sale at T-Rex Motors. Contact us at 765-238-2887.	<a href='http://www.carfax.com/VehicleHistory/p/Report.cfx?partner=DVW_1&vin=3C4PDCBB0KT874261'><img src='http://www.carfaxonline.com/assets/subscriber/carfax_free_button.gif' width='120' height='49' border='0'></a>	3C4PDCBB0KT874261	1050	\N	\N	\N	\N	0	0	0	unknown	\N	f	f	f	f	2025-07-24T03:43:40.497Z
42	2015-buick-enclave-1053	2015 BUICK ENCLAVE	Back up camera, heated/cooled seats, power everything	14999	for-sale	113,800 miles	2015	BUICK	ENCLAVE	Not specified	Not specified	Not specified	RED	beige	{https://storage.googleapis.com/msgsndr/QjiQRR74D1pxPF7I8fcC/media/8917743c-1709-41eb-ab41-244dea63cd32.jpeg,https://storage.googleapis.com/msgsndr/QjiQRR74D1pxPF7I8fcC/media/cfd3936e-20cc-4858-bb65-9f257ffcdd3c.jpeg,https://storage.googleapis.com/msgsndr/QjiQRR74D1pxPF7I8fcC/media/0b08d17a-8440-4951-953b-c121a0d584ed.jpeg}	{}	2015 BUICK ENCLAVE - T-Rex Motors Richmond, IN	2015 BUICK ENCLAVE for sale at T-Rex Motors. Contact us at 765-238-2887.	<a href='http://www.carfax.com/VehicleHistory/p/Report.cfx?partner=DVW_1&vin=5GAKVCKD7FJ328533'><img src='http://www.carfaxonline.com/assets/subscriber/carfax_free_button.gif' width='120' height='49' border='0'></a>	5GAKVCKD7FJ328533	1053	\N	\N	\N	\N	0	0	0	unknown	\N	f	f	f	f	2025-07-24T03:43:40.497Z
49	2018-chevrolet-silverado-lt-1042	2018 Chevrolet Silverado LT	Backup Camera; Cloth Seats; Daytime Running Lights; SiriusXM Equipped;	19999	for-sale	125,698 miles	2018	Chevrolet	Silverado LT	Not specified	Not specified	Not specified	White	Gray	{}	{}	2018 Chevrolet Silverado LT - T-Rex Motors Richmond, IN	2018 Chevrolet Silverado LT for sale at T-Rex Motors. Contact us at 765-238-2887.	<a href='http://www.carfax.com/VehicleHistory/p/Report.cfx?partner=DVW_1&vin=1GCRCREH7JZ369615'><img src='http://www.carfaxonline.com/assets/subscriber/carfax_free_button.gif' width='120' height='49' border='0'></a>	1GCRCREH7JZ369615	1042	\N	\N	\N	\N	0	0	0	unknown	\N	f	f	f	f	2025-07-24T03:43:40.497Z
50	2016-ford-focus-1044	2016 Ford Focus	Ford Focus in excellent condition	8999	for-sale	154,627 miles	2016	Ford	Focus	Not specified	Not specified	Not specified	Silver	Black	{}	{}	2016 Ford Focus - T-Rex Motors Richmond, IN	2016 Ford Focus for sale at T-Rex Motors. Contact us at 765-238-2887.	<a href='http://www.carfax.com/VehicleHistory/p/Report.cfx?partner=DVW_1&vin=1FADP3F26GL235069'><img src='http://www.carfaxonline.com/assets/subscriber/carfax_free_button.gif' width='120' height='49' border='0'></a>	1FADP3F26GL235069	1044	\N	\N	\N	\N	0	0	0	unknown	\N	f	f	f	f	2025-07-24T03:43:40.497Z
51	2020-chevrolet-malibu-1049	2020 Chevrolet Malibu	Backup Camera; Cloth Seats; Heated Passenger Seat; Heated Driver Seat, Remote Start	19999	for-sale	53,747 miles	2020	Chevrolet	Malibu	Not specified	Not specified	Not specified	Maroon	Black	{}	{}	2020 Chevrolet Malibu - T-Rex Motors Richmond, IN	2020 Chevrolet Malibu for sale at T-Rex Motors. Contact us at 765-238-2887.	<a href='http://www.carfax.com/VehicleHistory/p/Report.cfx?partner=DVW_1&vin=1G1ZD5STXLF043030'><img src='http://www.carfaxonline.com/assets/subscriber/carfax_free_button.gif' width='120' height='49' border='0'></a>	1G1ZD5STXLF043030	1049	\N	\N	\N	\N	0	0	0	unknown	\N	f	f	f	f	2025-07-24T03:43:40.497Z
53	2014-jeep-wrangler-sahara-unlimited-1057	2014 JEEP WRANGLER SAHARA UNLIMITED	Cloth Seats; Soft Top; Front Fog Lights; Daytime Running Lights; SiriusXM Equipped; CD Player; Cargo Floor Mat; Cruise Control; Remote Keyless Entry	16999	for-sale	176,130 miles	2014	JEEP	WRANGLER SAHARA UNLIMITED	Not specified	Not specified	Not specified	GRAY	black	{}	{}	2014 JEEP WRANGLER SAHARA UNLIMITED - T-Rex Motors Richmond, IN	2014 JEEP WRANGLER SAHARA UNLIMITED for sale at T-Rex Motors. Contact us at 765-238-2887.	<a href='http://www.carfax.com/VehicleHistory/p/Report.cfx?partner=DVW_1&vin=1C4BJWEG0EL300349'><img src='http://www.carfaxonline.com/assets/subscriber/carfax_free_button.gif' width='120' height='49' border='0'></a>	1C4BJWEG0EL300349	1057	\N	\N	\N	\N	0	0	0	unknown	\N	f	f	f	f	2025-07-24T03:43:40.497Z
54	2019-hyundai-santa-fe-1060	2019 HYUNDAI SANTA FE	Backup Camera; Cloth Seats; Daytime Running Lights; Touch Screen	13999	for-sale	122,171 miles	2019	HYUNDAI	SANTA FE	Not specified	Not specified	Not specified	SILVER	black	{}	{}	2019 HYUNDAI SANTA FE - T-Rex Motors Richmond, IN	2019 HYUNDAI SANTA FE for sale at T-Rex Motors. Contact us at 765-238-2887.	<a href='http://www.carfax.com/VehicleHistory/p/Report.cfx?partner=DVW_1&vin=5NMS23AD7KH023428'><img src='http://www.carfaxonline.com/assets/subscriber/carfax_free_button.gif' width='120' height='49' border='0'></a>	5NMS23AD7KH023428	1060	\N	\N	\N	\N	0	0	0	unknown	\N	f	f	f	f	2025-07-24T03:43:40.497Z
57	2016-buick-encore-1068	2016 BUICK ENCORE	Buick Encore in excellent condition	10999	for-sale	124,242 miles	2016	BUICK	ENCORE	Not specified	Not specified	Not specified	RED	Tan	{https://drive.google.com/uc?id=10G8jCydAIduxztWLeVOIL1QY0uAfXWNw,https://drive.google.com/uc?id=1apbCnv9WgL0b8P--cRaljYIlAJw9G_3G,https://drive.google.com/uc?id=1H2o6TI_4Ntj2CUatUKcsdECGtwdM2HuJ,https://drive.google.com/uc?id=1H2o6TI_4Ntj2CUatUKcsdECGtwdM2HuJ,https://drive.google.com/uc?id=1UiZ-OcoZnDXuYg-jvvpSPnhsHT6ZPMtA,https://drive.google.com/uc?id=1SMfSjTOwQ8QHidC-c_tmYnfHEhKhBWHd}	{}	2016 BUICK ENCORE - T-Rex Motors Richmond, IN	2016 BUICK ENCORE for sale at T-Rex Motors. Contact us at 765-238-2887.	<a href='http://www.carfax.com/VehicleHistory/p/Report.cfx?partner=DVW_1&vin=KL4CJ2SM3GB691491'><img src='http://www.carfaxonline.com/assets/subscriber/carfax_free_button.gif' width='120' height='49' border='0'></a>	KL4CJ2SM3GB691491	1068	\N	\N	\N	\N	0	0	0	unknown	\N	f	f	f	f	2025-07-24T03:43:40.497Z
56	2011-chevrolet-impala-1064	2011 CHEVROLET IMPALA	Chevrolet Impala in excellent condition	4999	for-sale	197,000 miles	2011	CHEVROLET	IMPALA	Not specified	Not specified	Not specified	RED	Tan	{https://lh3.googleusercontent.com/d/1dnnmkQKjHHlBvzgxRYyPB08m5i4xWJ8A=w800,https://lh3.googleusercontent.com/d/1q0Ir-3k5-vVm3jhYfrF3X5E_2Nd0ZFH7=w800,https://lh3.googleusercontent.com/d/1k6IPhcZi3kZ8rOGTOnv4Zbn0uC0qDxcS=w800,https://lh3.googleusercontent.com/d/1lcnJPKFoLshK97VK9U8Z1RwxOeHD-kO7=w800,https://lh3.googleusercontent.com/d/14TtCLbaW_pU86a6-WmGh50UNs7Dr1qc4=w800,https://lh3.googleusercontent.com/d/1A87qC6Edj80mYWkm-M5w8m4v8TfrbP_c=w800}	{}	2011 CHEVROLET IMPALA - T-Rex Motors Richmond, IN	2011 CHEVROLET IMPALA for sale at T-Rex Motors. Contact us at 765-238-2887.	<a href='http://www.carfax.com/VehicleHistory/p/Report.cfx?partner=DVW_1&vin=2G1WB5EK8B1236245'><img src='http://www.carfaxonline.com/assets/subscriber/carfax_free_button.gif' width='120' height='49' border='0'></a>	2G1WB5EK8B1236245	1064	\N	\N	\N	\N	0	0	0	unknown	\N	f	f	f	f	2025-07-24T03:43:40.497Z
44	2013-ford-flex-sel-1008	2013 Ford Flex SEL	Ford Flex SEL in excellent condition	8481	for-sale	155,359 miles	2013	Ford	Flex SEL	Not specified	Not specified	Not specified	white	grey	{https://lh3.googleusercontent.com/d/1ahTVcnbbMsVT3A4sXLXWeErnAp9my3or=w800,https://lh3.googleusercontent.com/d/1kyBMnWQn0fRnp2BZPbszLUQae4CUA7MD=w800,https://lh3.googleusercontent.com/d/1KT-AtYYWXNFbxJIzxVCWR0W7cDGhZqWa=w800,https://lh3.googleusercontent.com/d/1vJTUkQykIFjsc8ekelEkqN96U0F0d1QD=w800,https://lh3.googleusercontent.com/d/1NNJkiysO2yqGuv6CsHKPXeTQhSa35GxH=w800,https://lh3.googleusercontent.com/d/1NaJUnE6fVuoSNByDtl6_fOKVzgZFfAsD=w800,https://lh3.googleusercontent.com/d/1d3JadD7LRp498u6TANDH-ezI_G3Iwo8G=w800,https://lh3.googleusercontent.com/d/1LqboP2I5aXqHEqVXnVa61ybKh-UpEWpr=w800,https://lh3.googleusercontent.com/d/1W08RSFLvDv5Lil7AagQJkVABIyAzsrii=w800,https://lh3.googleusercontent.com/d/1coLonvhDepsuMKGKw26ckwTmF0KPi_0Q=w800,https://lh3.googleusercontent.com/d/1nnhY2iTj12Evb12qUfqbN5QlZaeZfYlD=w800,https://lh3.googleusercontent.com/d/1fMgcPHu1K_UdwXfr-GWSuEjOLI3ltVxv=w800,https://lh3.googleusercontent.com/d/1y63gewgXllfVCxCeTboReamAiOm7lYny=w800,https://lh3.googleusercontent.com/d/1jVVnrAmaKjEjx37MKj5qxb4UqdkGlkju=w800,https://lh3.googleusercontent.com/d/1WgZIgVc6CHRBZzN3ovWuNe-CKhpQRBeU=w800,https://lh3.googleusercontent.com/d/1bjvbhgrXQZBlk7UMpvqWDKw4Zuyhf8DX=w800,https://lh3.googleusercontent.com/d/1-RuXNXma2BYAuXa_ptozXIPKJAttwZsL=w800,https://lh3.googleusercontent.com/d/1-coIxV-nHTUECNhBdJMjIVFJhU2OKlZG=w800,https://lh3.googleusercontent.com/d/1ZwWCNj2BT0qhkjQIeLqGLbiK3mfj4ris=w800,https://lh3.googleusercontent.com/d/1u0Exnmyq7mOHdb4sS6Y2mX7STssy9t4U=w800,https://lh3.googleusercontent.com/d/1RdmIBdGgBck3_IBR-rJc35mOUxLO5rAf=w800,https://lh3.googleusercontent.com/d/1UTHqAxt9oy8pzNd5qpCGrOyAJllDLMJ1=w800,https://lh3.googleusercontent.com/d/1WlK6X07ijTrZ0aFdCwi_wCtiwV_MoMw_=w800}	{}	2013 Ford Flex SEL - T-Rex Motors Richmond, IN	2013 Ford Flex SEL for sale at T-Rex Motors. Contact us at 765-238-2887.	<a href='http://www.carfax.com/VehicleHistory/p/Report.cfx?partner=DVW_1&vin=2FMGK5C87DBD26742'><img src='http://www.carfaxonline.com/assets/subscriber/carfax_free_button.gif' width='120' height='49' border='0'></a>	2FMGK5C87DBD26742	1008	\N	\N	\N	\N	0	0	0	unknown	\N	f	f	f	f	2025-07-24T03:43:40.497Z
47	2018-honda-civic-1027	2018 Honda Civic	Backup Camera; Cloth Seats; Automatic Climate Control; Moonroof/Sunroof;	17999	for-sale	98,964 miles	2018	Honda	Civic	Not specified	Not specified	Not specified	White	Grey	{https://lh3.googleusercontent.com/d/1gp6RvBgWGdvCBInInrYC0GH-6BhBvukQ=w800,https://lh3.googleusercontent.com/d/10DM0LVYuM7BO-BCyVS4ZSEYkAepscoHI=w800,https://lh3.googleusercontent.com/d/1DGTNh9eMV2i5qqFJBxpswNGctlI2cZ98=w800,https://lh3.googleusercontent.com/d/1VrzHX619K0qeym9qnQ-dWEbRgxYduNAb=w800,https://lh3.googleusercontent.com/d/1yAHKQixjkZG8n8fI20q-yAFRD64IhFdv=w800,https://lh3.googleusercontent.com/d/1x7AkOLAOhoJIWXJGsOqhXA5Nnu7vtRtq=w800}	{}	2018 Honda Civic - T-Rex Motors Richmond, IN	2018 Honda Civic for sale at T-Rex Motors. Contact us at 765-238-2887.	<a href='http://www.carfax.com/VehicleHistory/p/Report.cfx?partner=DVW_1&vin=19XFC2F70JE022722'><img src='http://www.carfaxonline.com/assets/subscriber/carfax_free_button.gif' width='120' height='49' border='0'></a>	19XFC2F70JE022722	1027	\N	\N	\N	\N	0	0	0	unknown	\N	f	f	f	f	2025-07-24T03:43:40.497Z
46	2014-jeep-grand-cherokee-1024	2014 Jeep Grand Cherokee	Cloth Seats; Dual A/C Zones; Automatic Climate Control; Front Fog	12999	for-sale	120,955 miles	2014	Jeep	Grand Cherokee	Not specified	Not specified	Not specified	Red	Grey	{https://lh3.googleusercontent.com/d/1Ddld_oatcmFQmYECMk6AI3t3TRrXZ5Uz=w800,https://lh3.googleusercontent.com/d/1iw204UrvQhd96zpBcsNwfrZCuUhvdYwD=w800,https://lh3.googleusercontent.com/d/1vDLT2p0Ci2noR3-yOIPSqYXE9x6A8Nfq=w800,https://lh3.googleusercontent.com/d/1kretEHYvkLHezfRWL2b2FxcEUv_OymuV=w800,https://lh3.googleusercontent.com/d/1fkC7Mt9kIiSZDLk2CxPE9S9r5XspCDEv=w800,https://lh3.googleusercontent.com/d/1g56vCfd8FvHhZ7dj-TiQrjdMe4OOlJgt=w800,https://lh3.googleusercontent.com/d/1RSwHYXZl8JEExqVyjc7O8mVZGK6zdk4D=w800,https://lh3.googleusercontent.com/d/1zHiSAKYLhKiwGHm6eHJJQZpC9Xn5mo2z=w800,https://lh3.googleusercontent.com/d/10ZuCOou2q56cSvUnqIh2T7Q1tAmLPiyo=w800,https://lh3.googleusercontent.com/d/1eSmK44scYrsHzO_dfBLyB5GrN1imbIuh=w800,https://lh3.googleusercontent.com/d/1S6uq-vhsgkOEjWDYXbPwmnnVrGYayi2Y=w800,https://lh3.googleusercontent.com/d/19k9sNGuqvNlWoa-KS3LqMN2rrsxuslsx=w800,https://lh3.googleusercontent.com/d/17Rhp7_I48ACZ8tZFAyhBM7a7xC8qgl1U=w800,https://lh3.googleusercontent.com/d/113KK13h0A9Nf_GDbh2OCswFnoVqGPJ1L=w800,https://lh3.googleusercontent.com/d/1QVKdSMjKv2BqhF2e8JV2ZD-o-B8JAw_H=w800}	{}	2014 Jeep Grand Cherokee - T-Rex Motors Richmond, IN	2014 Jeep Grand Cherokee for sale at T-Rex Motors. Contact us at 765-238-2887.	<a href='http://www.carfax.com/VehicleHistory/p/Report.cfx?partner=DVW_1&vin=1C4RJFAG9EC422180'><img src='http://www.carfaxonline.com/assets/subscriber/carfax_free_button.gif' width='120' height='49' border='0'></a>	1C4RJFAG9EC422180	1024	\N	\N	\N	\N	0	0	0	unknown	\N	f	f	f	f	2025-07-24T03:43:40.497Z
\.


--
-- Name: customer_applications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.customer_applications_id_seq', 1, true);


--
-- Name: inquiries_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.inquiries_id_seq', 1, false);


--
-- Name: vehicles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.vehicles_id_seq', 58, true);


--
-- Name: customer_applications customer_applications_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.customer_applications
    ADD CONSTRAINT customer_applications_pkey PRIMARY KEY (id);


--
-- Name: inquiries inquiries_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.inquiries
    ADD CONSTRAINT inquiries_pkey PRIMARY KEY (id);


--
-- Name: vehicles vehicles_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_pkey PRIMARY KEY (id);


--
-- Name: vehicles vehicles_slug_unique; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_slug_unique UNIQUE (slug);


--
-- Name: vehicles vehicles_vin_unique; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.vehicles
    ADD CONSTRAINT vehicles_vin_unique UNIQUE (vin);


--
-- Name: customer_applications customer_applications_interested_vehicle_id_vehicles_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.customer_applications
    ADD CONSTRAINT customer_applications_interested_vehicle_id_vehicles_id_fk FOREIGN KEY (interested_vehicle_id) REFERENCES public.vehicles(id);


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO neon_superuser WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON TABLES TO neon_superuser WITH GRANT OPTION;


--
-- PostgreSQL database dump complete
--

