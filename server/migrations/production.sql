-- PostgreSQL database dump
--

-- Dumped from database version 12.0 (Debian 12.0-2.pgdg100+1)
-- Dumped by pg_dump version 12.0 (Debian 12.0-2.pgdg100+1)

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

--
-- Data for Name: merchant_users; Type: TABLE DATA; Schema: public; Owner: wizzit_pay
--

COPY public.merchant_users (id, email, password, first_name, last_name, merchant_id, role, active, created_at, updated_at) FROM stdin;
1	admin@wizzit.com	$2b$10$oCtMGEghRAI0dZHUH9pwqeTYve2oljYN7G.gqL3Jp5KWsQFJw4thK	God	Mode	\N	Admin	t	\N	\N
\.


--
-- Name: merchant_users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: wizzit_pay
--

SELECT pg_catalog.setval('public.merchant_users_id_seq', 1, true);


--
-- PostgreSQL database dump complete
--

