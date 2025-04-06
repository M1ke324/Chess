-- Progettazione Web
DROP DATABASE if exists castrucci_636159;
CREATE DATABASE  castrucci_636159;
USE  castrucci_636159;
-- MySQL dump 10.13  Distrib 5.7.33, for Linux (x86_64)
--
-- Host: localhost    Database: castrucci_636159
-- ------------------------------------------------------
-- Server version	5.7.33-0ubuntu0.16.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `matches`
--

DROP TABLE IF EXISTS `matches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `matches` (
  `match_id` int(11) NOT NULL AUTO_INCREMENT,
  `player1_id` int(11) NOT NULL,
  `player2_id` int(11) DEFAULT NULL,
  `moves` text,
  `round` tinyint(1) DEFAULT '1',
  `ended` tinyint(1) DEFAULT '0',
  `waiting` tinyint(1) DEFAULT '1',
  `winner` int(11) DEFAULT NULL,
  PRIMARY KEY (`match_id`),
  KEY `player1_id` (`player1_id`),
  KEY `player2_id` (`player2_id`),
  KEY `matches_ibfk_3` (`winner`),
  CONSTRAINT `matches_ibfk_1` FOREIGN KEY (`player1_id`) REFERENCES `users` (`id`),
  CONSTRAINT `matches_ibfk_2` FOREIGN KEY (`player2_id`) REFERENCES `users` (`id`),
  CONSTRAINT `matches_ibfk_3` FOREIGN KEY (`winner`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=178 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `matches`
--

LOCK TABLES `matches` WRITE;
/*!40000 ALTER TABLE `matches` DISABLE KEYS */;
INSERT INTO `matches` VALUES (116,16,17,'f2,pedone,f4;e7,pedone,e5;g1,cavallo,h3;f8,alfiere,c5;e1,regina,h4+;,,Resa;',1,1,0,16),(117,16,17,'f2,pedone,f4;d7,pedone,d5;,,Resa;',0,1,0,17),(118,17,16,'e2,pedone,e4;f7,pedone,f5;c2,pedone,c4;,,Resa;',1,1,0,17),(119,17,16,'e2,pedone,e4;d7,pedone,d5;d2,pedone,d4;e8,regina,a4;e4,pedone,e5;c8,alfiere,f5;h2,pedone,h3;a4,regina,c2#;',1,1,0,16),(120,17,16,'d2,pedone,d4;h7,pedone,h6;e1,regina,a5;h6,pedone,h5;c1,alfiere,f4;h5,pedone,h4;a5,regina,c7#;',0,1,0,17),(121,17,16,'d2,pedone,d4;h7,pedone,h6;e1,regina,a5;h6,pedone,h5;c1,alfiere,f4;h5,pedone,h4;a5,regina,c7#;',0,1,0,17),(122,16,17,',,Resa;',0,1,0,17),(123,17,16,'e2,pedone,e4;d7,pedone,d5;f1,alfiere,e2;e8,regina,a4;g2,pedone,g4;,,Resa;',1,1,0,17),(124,17,16,'g2,pedone,g4;d7,pedone,d5;h2,pedone,h4;b8,cavallo,c6;g1,cavallo,f3;g8,cavallo,f6;f3,cavallo,g5;h7,pedone,h6;f1,alfiere,g2;h6,pedone,g5;g2,alfiere,d5;f6,cavallo,d5;c2,pedone,c4;d5,cavallo,f4;h4,pedone,g5;c8,alfiere,g4;h1,torre,h8;g4,alfiere,e2+;d1,re,c2;c6,cavallo,d4#;',1,1,0,16),(126,16,17,'e2,pedone,e4;d7,pedone,d5;d2,pedone,d4;c8,alfiere,g4+;f1,alfiere,e2;g4,alfiere,h3;f2,pedone,f4;a7,pedone,a6;e2,alfiere,a6;b7,pedone,a6;g1,cavallo,e2;g7,pedone,g6;e2,cavallo,c3;g6,pedone,g5;c3,cavallo,a4;h7,pedone,h6;e1,regina,b4;h3,alfiere,g4+;,,Resa;',0,1,0,17),(127,16,17,'d2,pedone,d4;e7,pedone,e5;c1,alfiere,h6;f8,alfiere,b4;h2,pedone,h3;d7,pedone,d6;h3,pedone,h4;e8,regina,a4;h4,pedone,h5;g8,cavallo,e7;g2,pedone,g3;e7,cavallo,d5;g3,pedone,g4;d5,cavallo,b6;f2,pedone,f3;f7,pedone,f5;h1,torre,h2;f5,pedone,g4;h6,alfiere,g5+;,,Resa;',1,1,0,16),(130,17,16,'d2,pedone,d4;d7,pedone,d5;e2,pedone,e4;c8,alfiere,h3;e1,regina,a5;h7,pedone,h6;f1,alfiere,a6;h6,pedone,h5;g1,cavallo,e2;e7,pedone,e5;e2,cavallo,c3;g7,pedone,g6;c3,cavallo,d5;g6,pedone,g5;f2,pedone,f4;h3,alfiere,g4+;,,Resa;',0,1,0,16),(131,17,16,'g2,pedone,g4;d7,pedone,d5;e2,pedone,e4;h7,pedone,h6;d2,pedone,d4;h6,pedone,h5;e1,regina,a5;g8,cavallo,h6;f1,alfiere,a6;h8,torre,h7;f2,pedone,f4;h5,pedone,h4;g1,cavallo,e2;h4,pedone,h3;e2,cavallo,c3;g7,pedone,g6;c3,cavallo,b5;c8,alfiere,g4#;',1,1,0,16),(132,17,16,'g2,pedone,g4;e7,pedone,e5;d2,pedone,d4;d7,pedone,d5;e2,pedone,e4;e8,regina,a4;c1,alfiere,h6;f8,alfiere,a3;h2,pedone,h3;f7,pedone,f5;h3,pedone,h4;g8,cavallo,e7;h4,pedone,h5;e7,cavallo,c6;f2,pedone,f3;c6,cavallo,b4;h6,alfiere,g5#;',0,1,0,17),(133,17,16,'e2,pedone,e4;b7,pedone,b5;e1,regina,e3;c8,alfiere,a6;e3,regina,d4;d7,pedone,d5;d4,regina,d5#;',0,1,0,17),(134,16,17,'d2,pedone,d4;b7,pedone,b5;h2,pedone,h3;e7,pedone,e5;e1,regina,d2;e5,pedone,d4;d2,regina,d4;d7,pedone,d5;h3,pedone,h4;e8,regina,e3;f2,pedone,e3;g7,pedone,g6;a2,pedone,a3;f8,alfiere,h6;g2,pedone,g3;c8,alfiere,a6;d4,regina,d5+;b8,cavallo,d7;d5,regina,e5;d7,cavallo,c5;e5,regina,d5+;d8,re,c8;d5,regina,c5;c8,re,d8;c5,regina,d5#;',0,1,0,16),(135,17,16,'b2,pedone,b4;e7,pedone,e5;c1,alfiere,a3;e8,regina,e6;f2,pedone,f4;e6,regina,d5;e1,regina,h4+;f7,pedone,f6;d2,pedone,d4;d5,regina,d4+;b1,cavallo,d2;d4,regina,c4;d2,cavallo,e4;c4,regina,e4;f4,pedone,f5;e4,regina,d4+;d1,re,c1;e5,pedone,e4;h4,regina,h5;d4,regina,c4;c1,re,d1;c4,regina,d4#;',1,1,0,16),(151,17,16,'f2,pedone,f3;g7,pedone,g6;g2,pedone,g4;h7,pedone,h5;h2,pedone,h4;e7,pedone,e5;e2,pedone,e4;f7,pedone,f6;d2,pedone,d4;d7,pedone,d5;c2,pedone,c4;f6,pedone,f5;f3,pedone,f4;g6,pedone,g5;b2,pedone,b4;c7,pedone,c5;a2,pedone,a4;b7,pedone,b5;h4,pedone,g5;a7,pedone,a5;a4,pedone,b5;a5,pedone,b4;c4,pedone,d5;c5,pedone,d4;e4,pedone,f5;e5,pedone,f4;g4,pedone,h5;f4,pedone,f3;f5,pedone,f6;d4,pedone,d3;d5,pedone,d6;d3,pedone,d2;c1,alfiere,d2;f8,alfiere,d6;d2,alfiere,b4;g8,cavallo,h6;,,Resa;',0,1,0,16),(152,17,16,'g2,pedone,g4;g7,pedone,g5;f2,pedone,f4;h7,pedone,h5;e2,pedone,e4;f7,pedone,f5;d2,pedone,d4;e7,pedone,e5;c2,pedone,c4;d7,pedone,d5;b2,pedone,b4;c7,pedone,c5;a2,pedone,a4;b7,pedone,b5;g4,pedone,h5;g5,pedone,f4;e4,pedone,f5;e5,pedone,d4;c4,pedone,d5;c5,pedone,b4;a4,pedone,b5;f4,pedone,f3;f5,pedone,f6;d4,pedone,d3;d5,pedone,d6;b4,pedone,b3;b5,pedone,b6;f3,pedone,f2;f6,pedone,f7;d3,pedone,d2;d6,pedone,d7;b3,pedone,b2;b6,pedone,b7;g8,cavallo,f6;g1,cavallo,f3;b8,cavallo,c6;b1,cavallo,c3;c6,cavallo,d4;c3,cavallo,d5;f6,cavallo,e4;f3,cavallo,e5;e4,cavallo,c5;e5,cavallo,c4;d4,cavallo,f5;d5,cavallo,f4;,,Resa;',1,1,0,17),(153,16,17,'d2,pedone,d4;f7,pedone,f6;,,Resa;',0,1,0,17),(154,17,16,'e2,pedone,e4;g7,pedone,g6;d2,pedone,d4;f8,alfiere,g7;d1,re,d2;g7,alfiere,f6;b2,pedone,b3;f6,alfiere,g7;c1,alfiere,a3;g7,alfiere,h6+;,,Resa;',0,1,0,16),(155,16,17,'d2,pedone,d4;g7,pedone,g6;d1,re,d2;b7,pedone,b6;b2,pedone,b3;e7,pedone,e6;c1,alfiere,a3;f8,alfiere,h6+;d2,re,d3;h6,alfiere,g7;d3,re,d2;g7,alfiere,h6+;,,Resa;',0,1,0,17),(156,16,17,'d2,pedone,d3;c7,pedone,c5;e1,regina,a5#;',0,1,0,16),(157,16,17,'d2,pedone,d3;c7,pedone,c5;e1,regina,a5+;b7,pedone,b6;a5,regina,a6;b6,pedone,b5;a6,regina,a5+;,,Resa;',1,1,0,16),(159,17,16,'d2,pedone,d4;c7,pedone,c5;e1,regina,a5+;b7,pedone,b6;a5,regina,a6;b6,pedone,b5;a6,regina,a5#;',0,1,0,17),(163,16,17,'e2,pedone,e4;f7,pedone,f5;f1,alfiere,e2;e8,regina,h5;e2,alfiere,g4;h5,regina,g4+;f2,pedone,f3;f5,pedone,f4;g1,cavallo,h3;g4,regina,h3;e1,regina,h4;h3,regina,h4;b2,pedone,b3;h4,regina,g4;h2,pedone,h4;g4,regina,f3+;d1,re,e1;f3,regina,e3+;e1,re,f1;b7,pedone,b6;a2,pedone,a4;e3,regina,d3+;f1,re,g1;d3,regina,e2;b3,pedone,b4;g7,pedone,g6;h1,torre,h2;e2,regina,e1+;,,Resa;',0,1,0,17),(165,16,17,'f2,pedone,f4;f7,pedone,f5;e1,regina,h4;e8,regina,h5;h4,regina,h5;d7,pedone,d5;h5,regina,f7;b7,pedone,b6;f7,regina,f8+;d8,re,d7;f8,regina,f5+;d7,re,d8;f5,regina,f7;c8,alfiere,d7;c2,pedone,c3;c7,pedone,c6;f7,regina,f8+;d7,alfiere,e8;f8,regina,e8+;d8,re,c7;,,Resa;',0,1,0,17),(166,16,17,'d2,pedone,d4;f7,pedone,f6;e1,regina,a5;e8,regina,h5;c1,alfiere,f4;h5,regina,g5;a5,regina,d5;g5,regina,f4;a2,pedone,a3;f4,regina,e3;g1,cavallo,f3;e3,regina,f3;a3,pedone,a4;f3,regina,d3+;b1,cavallo,d2;d3,regina,d2+;d1,re,d2;h7,pedone,h6;d5,regina,f7;h6,pedone,h5;f7,regina,f8#;',0,1,0,16),(167,16,17,'e2,pedone,e4;d7,pedone,d5;g2,pedone,g4;f7,pedone,f5;e4,pedone,f5;,,Resa;',1,1,0,16),(168,16,17,'g2,pedone,g4;f7,pedone,f5;e2,pedone,e4;d7,pedone,d5;g4,pedone,f5;d5,pedone,e4;',1,0,0,NULL),(169,16,17,'d2,pedone,d4;f7,pedone,f6;e1,regina,a5;b7,pedone,b6;a5,regina,h5;f6,pedone,f5;h5,regina,g5;e8,regina,g6;g1,cavallo,f3;g6,regina,c6;f3,cavallo,e5;g7,pedone,g6;e5,cavallo,f7+;d8,re,e8;f7,cavallo,h8;e7,pedone,e6;h8,cavallo,g6;f8,alfiere,c5;b2,pedone,b3;d7,pedone,d6;a2,pedone,a4;g8,cavallo,h6;c2,pedone,c3;c5,alfiere,a3;b3,pedone,b4;b6,pedone,b5;a4,pedone,a5;a3,alfiere,b4;g5,regina,e7#;',0,1,0,16);
/*!40000 ALTER TABLE `matches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(61) NOT NULL,
  `victories` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (16,'Utente2','utente2@prova.it','$2y$10$V8XvlzdsflouwkctScQRLuDSuFlc7.4ixCZIn1fOgojIcRt7gZNHW',12),(17,'Utente','utente@prova.com','$2y$10$jMVSGCFFOUM50Fwi44DLeua/uaJNdr7Yq6CJJ941qA24aetZkMClC',19),(19,'Utente3','utente3@utente.it','$2y$10$qlRmDEwNwHhWg99E7Hp4a.3pO9iB0uJuKFJtR0YITkntEWseR/bQa',0),(20,'Michele','prova@michele.it','$2y$10$rU3gnv.UYM4xfpIkiC4IUu4uG6aMh/MIL9yx7/NW8.Pphf2W13ytO',0);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-04-06 17:56:10
