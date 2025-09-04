-- SQL script to insert all products from CSV into NeonDB
-- Run this script in your NeonDB console

-- Function to map product types to categories
-- Air Quality -> accessories
-- Pressure (Air & Liquid) -> accessories  
-- Level Measuring -> accessories
-- Flow sensors (Air & liquid) -> accessories
-- Smart Thermostat -> accessories
-- Temperature and humidity -> accessories

-- Clear existing products first to avoid duplicates
DELETE FROM products;

-- Insert all products with generated UUIDs and parsed specifications
INSERT INTO products (id, code, name, type, description, category, specifications, created_at, updated_at) VALUES

-- Air Quality Products
(gen_random_uuid(), 'TxCDT380', 'TxCDT380 - Carbon Dioxide (CO2) & Temperature (Wall and Duct)', 'Air Quality', 'TxCDT380 - Carbon Dioxide (CO2) & Temperature (Wall and Duct) - Standard model for Air Quality', 'accessories', '{"Co2Output": "VA, RS", "TempOutput": "VA, 1, 2, 3, 4, 5, 6, 7, RS", "Display": "1, 2"}', NOW(), NOW()),

(gen_random_uuid(), 'TxCDW33', 'Wall Mounted CO2 monitor', 'Air Quality', 'Wall Mounted CO2 monitor - Standard model for Air Quality', 'accessories', '{"MeasureRange": "2=2000ppm, 5=5000ppm, 10=10000ppm", "Output": "V5=0-5V, v10=0-10V, A=4-20mA, RS=RS485/Modbus"}', NOW(), NOW()),

(gen_random_uuid(), 'TxCDD34', 'Ducted CO2 monitor', 'Air Quality', 'Ducted CO2 monitor - Standard model for Air Quality', 'accessories', '{"MeasureRange": "2=2000ppm, 5=5000ppm", "Output": "5V=0-5V, 10V=0-10V, A=4-20mA, RS=RS485"}', NOW(), NOW()),

(gen_random_uuid(), 'TxCDI35', 'Indoor CO2 monitor', 'Air Quality', 'Indoor CO2 monitor - Standard model for Air Quality', 'accessories', '{"MeasureRange": "2=2000ppm, 5=5000ppm", "Output": "V5=0-5V, V10=0-10V, A=4-20mA, RS=RS485/Modbus", "Display": "1=Without digital display, 2=With digital display"}', NOW(), NOW()),

(gen_random_uuid(), 'TxCOW31', 'Wall-Mounted Carbon Monoxide (CO)', 'Air Quality', 'Wall-Mounted Carbon Monoxide (CO) - Standard model for Air Quality', 'accessories', '{"MeasureRange": "1=500ppm, 2=1000ppm", "Output": "V5=0-5V, V10=0-10V, A=4-20mA, RS=RS485/Modbus"}', NOW(), NOW()),

(gen_random_uuid(), 'TxCOI32', 'Indoor Carbon Monoxide (CO)', 'Air Quality', 'Indoor Carbon Monoxide (CO) - Standard model for Air Quality', 'accessories', '{"MeasureRange": "", "Output": "AV, RS", "Display": "1, 2", "Relay": "1, 2"}', NOW(), NOW()),

(gen_random_uuid(), 'TxAQ37', 'All-in-One Air Quality Transducer', 'Air Quality', 'All-in-One Air Quality Transducer - Standard model for Air Quality', 'accessories', '{"Installation": "1, 2", "TempRH": "1, 2", "Co2": "1, 2", "Pm": "1, 2", "Voc": "1, 2", "Formaldehyde": "1, 2", "OutputType": "RSN, RS", "Display": "1, 2", "IndicationLight": "1, 2"}', NOW(), NOW()),

(gen_random_uuid(), 'AQS820', 'Air Quality Sensor', 'Air Quality', 'Air Quality Sensor - Standard model for Air Quality', 'accessories', '{"Output": "V5=0-5V, V10=0-10V, A=4-20mA, RS=RS485/Modbus"}', NOW(), NOW()),

-- Pressure Products
(gen_random_uuid(), 'TXADP12', 'TXADP12', 'Pressure (Air & Liquid)', 'TXADP12 - Standard model for Pressure (Air & Liquid)', 'accessories', '{"PressureRange": "2=-100~100pa, 4=-1000~1000Pa, 6=-10000~10000Pa", "Display": "1=Without Display, 2=With Display", "Output": "AV=4-20mA/0-10VDC (Simultaneous output), A=4-20mA (Two-wired), V10=0-10VDC (Three-wired), V5=0-5VDC (Three-wired), RS=RS-485 communication, RSW=RS-485 communication (with isolation)"}', NOW(), NOW()),

(gen_random_uuid(), 'DPS52', 'DPS52', 'Pressure (Air & Liquid)', 'DPS52 - Standard model for Pressure (Air & Liquid)', 'accessories', '{"ConnectorMaterial": "1, 2", "ConnectorThread": "1, 2, 3, 4, 5, 6, 7", "Wiring": "1, 2"}', NOW(), NOW()),

(gen_random_uuid(), 'DPS18', 'DPS18', 'Pressure (Air & Liquid)', 'DPS18 - Standard model for Pressure (Air & Liquid)', 'accessories', '{"PressureRange": "01=20-200 Pa, 02=30-300 Pa, 03=40-400 Pa, 04=50-500 Pa, 05=200-1000 Pa, 06=100-1000 Pa, 07=500-2500 Pa, 08=1000-5000 Pa"}', NOW(), NOW()),

(gen_random_uuid(), 'TxDP35', 'TxDP35', 'Pressure (Air & Liquid)', 'TxDP35 - Standard model for Pressure (Air & Liquid)', 'accessories', '{"Output": "A, V10, RS", "Unit": "K, P, B, M", "Accuracy": "0.25, 0.5", "ElectricalConnection": "D, M, C3, C4, H", "PressureConnection": "G, N, G2, M20, M14, M10, U, R", "CableLength": "1, 2, 3"}', NOW(), NOW()),

(gen_random_uuid(), 'TxLDP16', 'TxLDP16', 'Pressure (Air & Liquid)', 'TxLDP16 - Standard model for Pressure (Air & Liquid)', 'accessories', '{"PressureRange": "101D=0±100Pa (two-way), 101G=0-100Pa (one-way), 102D=0±1000Pa, 102G=0-1000Pa, 251D=0±250Pa, 251G=0-250Pa, 252D=0±2500Pa, 252G=0-2500Pa, 051D=0±50Pa, 051G=0-50Pa, 501D=0±500Pa, 501G=0-500Pa, 502D=0±5000Pa, 502G=0-5000Pa, 103D=0±10000Pa", "Output": "A=4-20mA (Two-wired), V10=0-10VDC (Three-wired), V5=0-5VDC (Three-wired), RS=RS485, RsV10=RS485, 0-10VDC, RsV5=RS485, 0-5VDC, RsA=RS485, 4-20mA"}', NOW(), NOW()),

-- Level Measuring Products
(gen_random_uuid(), 'TxSL20', 'TxSL20 - Submersible Liquid Level Tranducer', 'Level Measuring', 'TxSL20 - Submersible Liquid Level Tranducer - Standard model for Level Measuring', 'accessories', '{"Output": "A, V0, V5, V10, RS", "Unit": "M, CM", "Accuracy": "0.5", "ElectricalConnection": "M", "Display": "1, 2", "CableLength": "1, 2"}', NOW(), NOW()),

(gen_random_uuid(), 'TxSL22', 'TxSL22 - Liquid Temperature and Level 2 in 1 Tranducer', 'Level Measuring', 'TxSL22 - Liquid Temperature and Level 2 in 1 Tranducer - Standard model for Level Measuring', 'accessories', '{"Output": "A=4-20mA, V0=0.5-4.5V, RS=RS485", "Unit": "M=M=Meter, CM=CM=Centimeter", "Accuracy": "0.5=0.5 = 0.5%F.S.", "ElectricalConnection": "M=M=M12 waterproof outlet", "CableLength": "1=1.0=1m, 2=2.0=2m, 3=3.0=3m", "Range": "200=0~1...200mH2O", "TempRange": "100=-20~100°C"}', NOW(), NOW()),

-- Flow Sensors
(gen_random_uuid(), 'LFS22', 'Liquid Flow Switch', 'Flow sensors (Air & liquid)', 'Liquid Flow Switch - Standard model for Flow sensors (Air & liquid)', 'accessories', '{"ConnectionSize": "1=1\"\"NPT Size, 2=2/1\"\"NPT, 3=4/3\"\"NPT", "Material": "1=Brass (for water or other liquids suitable for brass), 2=Stainless steel (for ammonia and other liquids suitable for stainless steel)"}', NOW(), NOW()),

-- Smart Thermostat
(gen_random_uuid(), 'VTRM20-XP', 'VAV (Variable Air Volume) controllers', 'Smart Thermostat', 'VAV (Variable Air Volume) controllers - Standard model for Smart Thermostat', 'accessories', '{"Communication": "1=MOD Modbus RS485, 2=BAC BACnet MS/TP", "Interface": "1=No Interface, 2=Colour Capacitive Touchscreen, 3=Bluetooth App Interface, 4=Touchscreen and Bluetooth, 5=LoraWan Wireless Interface, EU868Mhz, 6=LoraWan Wireless Interface EU868MHz with Touchscreen", "Measurement": "1=No Extra Measurements, 2=Relative Humidity, 3=Volatile Organic Compound and Humidity, 4=Passive Infrared Movement (PIR), 5=Relative Humidity and Movement (PIR), 6=VOC, Relative Humidity and Movement (PIR)", "Output": "1=No Output Options, 2=24V Relay Output", "Color": "B=Black, W=White"}', NOW(), NOW()),

-- Temperature and Humidity Products
(gen_random_uuid(), 'TxTA03-V10-25-1-1-G2-1-1-1', 'TxTA03 Armored Temperature Sensor', 'Temperature and humidity', 'TxTA03 Armored Temperature Sensor - Custom model', 'accessories', '{"Temperature Output": "TxTA03V10=0~10VDC(3-wire), TxTA03A=4~20mA(2-wire), TxTA03RS=RS485/Modbus , TxTA031=Pt100, ±0.2°C@0°C, TxTA032=Pt1000, ±0.2°C@0°C", "Accuracy": "TxTA0325=0.25%FS , TxTA0350=0.5%FS", "Temperature Range": "TxTA031=0~100℃ , TxTA032=0~200℃ (with cold end) , TxTA033=0~300℃ (with cold end) , TxTA034=-50~150℃ (with cold end) , TxTA035=-50~300℃ (with cold end) , TxTA039=customized (-50~300℃)", "Wiring Box": "TxTA031=Wiring Box", "Installation Method": "TxTA03G2=G1/2 male (fixed thread installation, TxTA03G4=G1/4 male (fixed thread installation) , TxTA03M=M16*1.5 male (fixed thread installation) , TxTA03M2=M20*1.5 male (fixed thread installation) , TxTA03M7=M27*2 male (fixed thread installation) , TxTA03C=Clamp (50.5MM) , TxTA03D=Direct Insert Type", "Protective Tube": "TxTA031=Without, TxTA032=With", "Probe length (without thread)": "TxTA031=30mm (Sleeved Type ), TxTA032=50mm (Sleeved Type ), TxTA033=100mm (Sleeved Type ), TxTA034=150mm (Sleeved Type ), TxTA035=200mm (Sleeved Type ), TxTA036=300mm (Sleeved Type ), TxTA039=customized (Sleeved Type ), TxTA031D=130mm (Direct Insert Type ), TxTA032D=200mm (Direct Insert Type ), TxTA033D=250mm (Direct Insert Type ), TxTA034D=300mm (Direct Insert Type ), TxTA035D=400mm (Direct Insert Type ), TxTA039D=customized (Direct Insert Type )", "Code End": "TxTA031=Without cold end (15mm) , TxTA032=Cold end length 100mm) , TxTA039=Customized"}', NOW(), NOW()),

(gen_random_uuid(), 'TxTI04-V10-1-G2-1-1-1', 'TxTI04 Integrated Temperature Sensor', 'Temperature and humidity', 'TxTI04 Integrated Temperature Sensor - Custom model', 'accessories', '{"Temperature Output": "TxTI04V10=0~10VDC(3-wire), TxTI04A=4~20mA(2-wire), TxTI041=Pt100, ±0.2°C@0°C, TxTI042=Pt1000, ±0.2°C@0°C", "Temperature Range": "TxTI041=0~100℃ , TxTI042=0-200°C , TxTI043=-50-50°C , TxTI044=-50-100°C , TxTI045=-50-200°C , TxTI049=customized (-50-200°C)", "Installation Method": "TxTI04G2=G1/2 male (fixed thread installation), TxTI04G4=G1/4 male (fixed thread installation) , TxTI04M=M20-1.5 male (fixed thread installation) , TxTI04C=clamp (50.5MM) , TxTI04D=Direct Insert Type", "Protective Tube": "TxTI041=without , TxTI042=with", "Probe Length": "TxTI041=30mm (Integrated Type ), TxTI042=50mm (Integrated Type ), TxTI043=100mm (Integrated Type ), TxTI044=150mm (Integrated Type ), TxTI045=200mm (Integrated Type ), TxTI046=300mm (Integrated Type ), TxTI049=customized (Integrated Type ), TxTI041D=130mm (Direct Insert Type) , TxTI042D=200mm (Direct Insert Type) , TxTI043D=250mm (Direct Insert Type) , TxTI044D=300mm (Direct Insert Type ) , TxTI045D=400mm (Direct Insert Type) , TxTI049D=customized (Direct Insert Type)", "Display": "TxTI041=Without Display, TxTI042=With Display"}', NOW(), NOW()),

(gen_random_uuid(), 'TxTHM98-1', 'TxTHM98 Magnetic Temperature & Humidity Sensor', 'Temperature and humidity', 'TxTHM98 Magnetic Temperature & Humidity Sensor - Custom model', 'accessories', '{"Display": "TxTHM981=Without Dispaly, TxTHM982=With Dispaly"}', NOW(), NOW()),

(gen_random_uuid(), 'CTH27-3-V10-V10-1-2-1', 'CTH27 Indoor Temperature Humidity Controller', 'Temperature and humidity', 'CTH27 Indoor Temperature Humidity Controller - Custom model', 'accessories', '{"Accuracy Range": "CTH273=±3%RH(±0.5°C)", "Humidity Output": "CTH27V10=0~10VDC(3-wire), CTH27RS=RS485/Modbus", "Temperature Output": "CTH27V10=0~10VDC(3-wire), CTH27RS=RS485/Modbus, CTH271=Pt100, ±0.2°C@0°C, CTH272=Pt1000, ±0.2°C@0°C , CTH273=NTC10K, ±0.4°C@25°C, CTH274=NTC20K, ±0.4°C@25°C", "Temperature Range": "CTH271=NO , CTH272=0~50°C, CTH273=-20~60°C, CTH279=Others ( customerized)", "Display": "CTH272=Setting button, backlight LCD display with unit", "Alarm and relay": "CTH271=Alarm only, CTH272=Relay only, CTH273=Alarm and relay"}', NOW(), NOW()),

(gen_random_uuid(), 'TxTHO23-3-V10-V10-1', 'TxTHO23 Outdoor Temperature And Humidity Sensor', 'Temperature and humidity', 'TxTHO23 Outdoor Temperature And Humidity Sensor - Custom model', 'accessories', '{"Accuracy Range": "TxTHO233=±3%RH(±0.5°C)", "Humidity Output": "TxTHO23V10=0~10VDC(3-wire), TxTHO23A=4~20mA(2-wire), TxTHO23RS=RS485/Modbus", "Temperature Output": "TxTHO23V10=0~10VDC(3-wire), TxTHO23A=4~20mA(2-wire), TxTHO23RS=RS485/Modbus, TxTHO231=Pt100, ±0.2°C@0°C, TxTHO232=Pt1000, ±0.2°C@0°C , TxTHO233=NTC10K, ±0.4°C@25°C, TxTHO234=NTC20K, ±0.4°C@25°C", "Temperature Range": "TxTHO231=NO , TxTHO232=0~50°C, TxTHO233=-20~60°C, TxTHO239=Others ( customerized)"}', NOW(), NOW()),

(gen_random_uuid(), 'TxTH29-W-3-V10-V10-1-1', 'TxTH29 Temperature & Humidity Sensor', 'Temperature and humidity', 'TxTH29 Temperature & Humidity Sensor - Custom model', 'accessories', '{"Model": "TxTH29W=Wall-mounted, TxTH29D=Duct, TxTH29S=Split", "Accuracy Range": "TxTH293=±3%RH(±0.5°C)", "Humidity Output": "TxTH29V10=0~10VDC(3-wire, TxTH29A=4~20mA(2-wire), TxTH29RS=RS485/Modbus", "Temperature Output": "TxTH29V10=0~10VDC(3-wire, TxTH29A=4~20mA(2-wire), TxTH29RS=RS485/Modbus, TxTH291=Pt100, ±0.2°C@0°C, TxTH292=Pt1000, ±0.2°C@0°C , TxTH293=NTC10K，±0.4℃@25℃, TxTH294=NTC20K，±0.4℃@25℃", "Temperature Range": "TxTH291=NO , TxTH292=0~50°C, TxTH293=-20~60°C, TxTH299=Others (customerized)", "Display": "TxTH291=No display, TxTH292=LCD display"}', NOW(), NOW()),

(gen_random_uuid(), 'TxTH05-W-2-V10-V10-1-1', 'TxTH05 Temperature and Humidity Sensor – Duct & Wall', 'Temperature and humidity', 'TxTH05 Temperature and Humidity Sensor – Duct & Wall - Custom model', 'accessories', '{"Model": "TxTH05W=Wall-mounted, TxTH05D=Duct, TxTH05S=Split", "Accuracy Range": "TxTH052=±2%RH(0.3℃), TxTH053=±3%RH(0.3℃)", "Humidity Output": "TxTH05V10=0~10VDC(3-wire), TxTH05A=4~20mA(2-wire), TxTH05RS=RS485/Modbus", "Temperature Output": "TxTH05V10=0~10VDC(3-wire), TxTH05A=4~20mA(2-wire), TxTH05RS=RS485/Modbus, TxTH051=Pt100, ±0.2°C@0°C, TxTH052=Pt1000, ±0.2°C@0°C , TxTH053=NTC20K，±0.4℃@25℃, TxTH054=Ni 1000，±0.4℃@25℃, TxTH055=NTC10K-II, ±0.4℃@25℃, TxTH056=NTC10K-III, ±0.4℃@25℃, TxTH057=NTC10K-A, ±0.4℃@25℃", "Temperature Range": "TxTH051=NO , TxTH052=0~50°C, TxTH053=-20~60°C, TxTH059=Others ( customerized)", "Display Mode": "TxTH051=No display, TxTH052=LCD display"}', NOW(), NOW()),

(gen_random_uuid(), 'TxTHP96-3-V10-V10-1', 'TxTHP96 Probe Type Temperature and Humidity Sensor', 'Temperature and humidity', 'TxTHP96 Probe Type Temperature and Humidity Sensor - Custom model', 'accessories', '{"Accuracy Range": "TxTHP963=±3%RH(±0.5°C)", "Humidity Output": "TxTHP96V10=0~10VDC(3-wire), TxTHP96A=4~20mA(two wires), TxTHP96RS=RS485/Modbus", "Temperature Output": "TxTHP96V10=0~10VDC(3-wire), TxTHP96A=4~20mA(two wires), TxTHP96A=RS485/Modbus", "Temperature Range": "TxTHP961=NO, TxTHP962=0~50°C, TxTHP963=-20~60°C, TxTHP969=Others (customerized)"}', NOW(), NOW()),

(gen_random_uuid(), 'TxT02-W-V10-1-1', 'TxT02 Temperature Sensor', 'Temperature and humidity', 'TxT02 Temperature Sensor - Custom model', 'accessories', '{"Model": "TxT02W=Wall-mounted, TxT02D=Duct type, TxT02C=Clamp type, TxT02S=Separated type, TxT02P=Tube type/ water pipe type", "Temperature Output": "TxT02V10=0~10VDC(3-wire), TxT02A=4~20mA(2-wire), TxT02V5=0~5VDC(3 wire), TxT021=Pt100, ±0.2°C@0°C, TxT022=Pt1000, ±0.2°C@0°C, TxT023=NTC20K, ±0.4°C@25°C, TxT024=Ni 1000, ±0.4°C@25°C, TxT025=NTC10K-II,±0.4°C@25°C, TxT026=NTC10K-III,±0.4°C@25°C, TxT027=NTC10K-A,±0.4°C@25°C", "Temperature Range": "TxT021=NO, TxT022=0~50°C, TxT023=20~60°C, TxT029=Others (customerized)", "Probe Length": "TxT021=65MM, TxT022=100MM, TxT023=150MM, TxT024=200MM, TxT029=Others (customerized)"}', NOW(), NOW()),

(gen_random_uuid(), 'TxTHI28-3-V10-V10-1-1', 'TxTHI28 Indoor Temperature Humidity Sensor', 'Temperature and humidity', 'TxTHI28 Indoor Temperature Humidity Sensor - Custom model', 'accessories', '{"Accuracy Range": "TxTHI283=±3%RH(±0.5°C)", "Humidity Output": "TxTHI28V10=0~10VDC(3-wire), TxTHI28A=4~20mA(2-wire), TxTHI28RS=RS485/Modbus, TxTHI28N=No output", "Temperature Output": "TxTHI28V10=0~10VDC(3-wire), TxTHI28A=4~20mA(2-wire), TxTHI28RS=RS485/Modbus, TxTHI28N=No output, TxTHI281=Pt100, ±0.2°C@0°C, TxTHI282=Pt1000, ±0.2°C@0°C, TxTHI283=NTC10K, ±0.4°C@25°C, TxTHI284=NTC20K, ±0.4°C@25°C", "Temperature Range": "TxTHI281=NO, TxTHI282=0~50°C, TxTHI283=-20~60°C, TxTHI289=Others (customerized)", "Display": "TxTHI281=without display, TxTHI282=with display"}', NOW(), NOW());

-- Verify the insert
SELECT COUNT(*) as total_products FROM products;
SELECT code, name, category FROM products ORDER BY code;