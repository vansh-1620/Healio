CREATE TABLE IF NOT EXISTS doctor (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(120),
  specialty VARCHAR(120),
  clinic VARCHAR(200),
  lat DOUBLE,
  lon DOUBLE
);

INSERT INTO doctor (name, specialty, clinic, lat, lon) VALUES
('Dr. A Sharma','General Physician','City Clinic',28.6139,77.2090),
('Dr. Meera Patel','Pulmonologist','HealthCare Center',28.6200,77.2100),
('Dr. Raj Verma','ENT','ENT Clinic',28.6090,77.2000);