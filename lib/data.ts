import { getCustomProductSpecifications } from "@/utils/product-utils"

export const sensorTypes = [
  {
    id: "temp-humid",
    name: "Temperature and Humidity",
    icon: "Thermometer",
    description: "Temperature and humidity sensors for various applications",
    specifications: {
      model: [
        { value: "TxTH52", label: "TxTH52 - Outdoor Temperature and Humidity Transmitter" },
        { value: "TxTH28N", label: "TxTH28N - Industrial Temperature and Humidity" },
        { value: "TxTH91-XP", label: "TxTH91-XP - Room Humidity and Temperature Sensor" },
        { value: "TxTHP", label: "TxTHP - Temperature and Humidity Sensor Probe" },
        { value: "TxT02", label: "TxT02 - Air Temperature Transducer" },
        { value: "TxTH28", label: "TxTH28 - Indoor Temperature Humidity Sensor" },
      ],
      accuracy: [{ value: "3", label: "±3%RH(±0.5℃)" }],
      humidityOutput: [
        { value: "V10", label: "0-10VDC(3-wire)" },
        { value: "A", label: "4-20mA(2-wire)" },
        { value: "RS", label: "RS485/Modbus" },
      ],
      temperatureOutput: [
        { value: "V10", label: "0-10VDC(3-wire)" },
        { value: "A", label: "4-20mA(2-wire)" },
        { value: "RS", label: "RS485/Modbus" },
        { value: "1", label: "Pt100, ±0.2��@0℃" },
        { value: "2", label: "Pt1000, ±0.2℃@0℃" },
        { value: "3", label: "NTC10K, ±0.4℃@25℃" },
        { value: "4", label: "NTC20K, ±0.4℃@25℃" },
      ],
      temperatureRange: [
        { value: "1", label: "0-50℃" },
        { value: "2", label: "-20-60℃" },
        { value: "9", label: "Others (customerized)" },
      ],
      display: [
        { value: "1", label: "Without display" },
        { value: "2", label: "With display" },
      ],
      communication: [
        { value: "1", label: "MOD Modbus RS485" },
        { value: "2", label: "BAC BACnet MS/TP" },
      ],
      interface: [
        { value: "1", label: "No Interface" },
        { value: "2", label: "Colour Display" },
      ],
      color: [
        { value: "B", label: "Black" },
        { value: "W", label: "White" },
      ],
      probeLength: [
        { value: "0", label: "65MM" },
        { value: "1", label: "100MM" },
        { value: "2", label: "200MM" },
        { value: "3", label: "150MM" },
        { value: "9", label: "Customized" },
      ],
    },
  },
  {
    id: "air-quality",
    name: "Air Quality",
    icon: "Wind",
    description: "Sensors for monitoring various air quality parameters",
    specifications: {
      model: [
        { value: "TxCDT380", label: "TxCDT380 - Carbon Dioxide (CO2) & Temperature (Wall and Duct)" },
        { value: "TxCDW33", label: "TxCDW33 - Wall Mounted CO2 monitor" },
        { value: "TxCDD34", label: "TxCDD34 - Ducted CO2 monitor" },
        { value: "TxCDI35", label: "TxCDI35 - Indoor CO2 monitor" },
        { value: "TxDI36", label: "TxDI36 - Indoor CO2 monitor" },
        { value: "TxCOW31", label: "TxCOW31 - Wall mounted electrochemical CO sensor" },
        { value: "TxCOI32", label: "TxCOI32 - Indoor carbon monoxide transducer" },
        { value: "TxAQ37", label: "TxAQ37 - ALL-IN-ONE AIR QUALITY TRANDUCER" },
        { value: "AQS820", label: "AQS820 - Air Quality Sensor" },
      ],
      measureRange: {
        CO: [
          { value: "1", label: "500ppm" },
          { value: "2", label: "1000ppm" },
        ],
        CO2: [
          { value: "2", label: "2000ppm" },
          { value: "5", label: "5000ppm" },
        ],
      },
      co2Output: [
        { value: "VA", label: "4-20mA/0-10VDC" },
        { value: "RS", label: "RS485/Modbus" },
      ],
      tempOutput: [
        { value: "VA", label: "4-20mA/0-10VDC" },
        { value: "1", label: "PT1000, ±0.2°C @25°C" },
        { value: "2", label: "PT100, ±0.2°C @25°C" },
        { value: "3", label: "NTC20K, ±0.2°C @25°C" },
        { value: "4", label: "NI1000, ±0.5°C @25°C" },
        { value: "5", label: "NTC10K-II, ±0.2°C @25°C" },
        { value: "6", label: "NTC10K-III, ±0.3°C @25°C" },
        { value: "7", label: "NTC10K-A, ±0.3°C @25°C" },
        { value: "RS", label: "RS485/Modbus" },
      ],
      output: [
        { value: "V5", label: "0-5V" },
        { value: "V10", label: "0-10V" },
        { value: "A", label: "4-20mA" },
        { value: "RS", label: "RS485/Modbus" },
      ],
      display: [
        { value: "1", label: "Without digital display" },
        { value: "2", label: "With digital display" },
      ],
      relay: [
        { value: "1", label: "N/A" },
        { value: "2", label: "1xSPDT" },
      ],
      installation: [
        { value: "1", label: "Indoor type" },
        { value: "2", label: "Top suction type" },
      ],
      tempRH: [
        { value: "1", label: "N/A" },
        { value: "2", label: "Temp&RH" },
      ],
      pm: [
        { value: "1", label: "N/A" },
        { value: "2", label: "PM2.5&PM10" },
      ],
      voc: [
        { value: "1", label: "N/A" },
        { value: "2", label: "VOC" },
      ],
      formaldehyde: [
        { value: "1", label: "N/A" },
        { value: "2", label: "HCHO" },
      ],
      outputType: [
        { value: "RSN", label: "Non-isolated RS485" },
        { value: "RS", label: "Isolation type of RS485" },
      ],
      indicationLight: [
        { value: "1", label: "None" },
        { value: "2", label: "With 3-color LED" },
      ],
    },
  },
  {
    id: "pressure",
    name: "Pressure (Air & Liquid)",
    icon: "Gauge",
    description: "Sensors for monitoring pressure in air and liquid systems",
    specifications: {
      model: [
        { value: "TXADP12", label: "TXADP12 - Differential Pressure Sensor" },
        { value: "DPS52", label: "DPS52 - Differential Pressure Switch" },
        { value: "DPS18", label: "DPS18 - Differential Pressure Sensor" },
        { value: "TxDP35", label: "TxDP35 - Differential Pressure Transmitter" },
        { value: "TxLDP16", label: "TxLDP16 - Low Differential Pressure Transducer" },
      ],
      pressureRange: {
        TXADP12: [
          { value: "2", label: "-100~100pa" },
          { value: "4", label: "-1000~1000Pa" },
          { value: "6", label: "-10000~10000Pa" },
        ],
        DPS18: [
          { value: "01", label: "20-200 Pa" },
          { value: "02", label: "30-300 Pa" },
          { value: "03", label: "40-400 Pa" },
          { value: "04", label: "50-500 Pa" },
          { value: "05", label: "200-1000 Pa" },
          { value: "06", label: "100-1000 Pa" },
          { value: "07", label: "500-2500 Pa" },
          { value: "08", label: "1000-5000 Pa" },
        ],
        TxLDP16: [
          { value: "101D", label: "0±100Pa (two-way)" },
          { value: "101G", label: "0-100Pa (one-way)" },
          { value: "102D", label: "0±1000Pa" },
          { value: "102G", label: "0-1000Pa" },
          { value: "251D", label: "0±250Pa" },
          { value: "251G", label: "0-250Pa" },
          { value: "252D", label: "0±2500Pa" },
          { value: "252G", label: "0-2500Pa" },
          { value: "051D", label: "0±50Pa" },
          { value: "051G", label: "0-50Pa" },
          { value: "501D", label: "0±500Pa" },
          { value: "501G", label: "0-500Pa" },
          { value: "502D", label: "0±5000Pa" },
          { value: "502G", label: "0-5000Pa" },
          { value: "103D", label: "0±10000Pa" },
        ],
      },
      display: [
        { value: "1", label: "Without Display" },
        { value: "2", label: "Display" },
      ],
      output: [
        { value: "AV", label: "20-4mA +10-0VDC (Simultaneous output)" },
        { value: "A", label: "20-4mA (Two-wired)" },
        { value: "V10", label: "0-10VDC (Three-wired)" },
        { value: "V5", label: "0-5VDC (Three-wired)" },
        { value: "RS", label: "RS-485 communication" },
        { value: "RSW", label: "RS-485 communication (with isolation)" },
        { value: "RsV10", label: "RS485, 0-10VDC" },
        { value: "RsV5", label: "RS485, 0-5VDC" },
        { value: "RsA", label: "RS485, 4-20mA" },
      ],
      connectorMaterial: [
        { value: "1", label: "Brass" },
        { value: "2", label: "SS 316L" },
      ],
      connectorThread: [
        { value: "1", label: '7/16" UNF FEMALE' },
        { value: "2", label: '7/16" UNF MALE' },
        { value: "3", label: 'R1/4" MALE' },
        { value: "4", label: 'G1/4" MALE' },
        { value: "5", label: '1/4"NPT MALE' },
        { value: "6", label: "connect φ8 soft tube" },
        { value: "7", label: "connect φ6 steel pipe" },
      ],
      wiring: [
        { value: "1", label: "Plastic Gland PG16" },
        { value: "2", label: "Brass Nickel Plated Gland PG16" },
      ],
      unit: [
        { value: "K", label: "kPa" },
        { value: "P", label: "psi" },
        { value: "B", label: "bar" },
        { value: "M", label: "MPa" },
      ],
      accuracy: [
        { value: "0.25", label: "0.25 = 0.25%F.S." },
        { value: "0.5", label: "0.5 = 0.5%F.S." },
      ],
      electricalConnection: [
        { value: "D", label: "D = DIN43650A (Big Hirschmann)" },
        { value: "M", label: "M = M12 Waterproof outlet" },
        { value: "C3", label: "C3=GX12 three cores aviation connector" },
        { value: "C4", label: "C4=GX12 four cores aviation connector" },
        { value: "H", label: "H = M12 four cores aviation connector" },
      ],
      pressureConnection: [
        { value: "G", label: "G = G1/4" },
        { value: "N", label: "N = NPT1/4" },
        { value: "G2", label: "G2 = G1/2" },
        { value: "M20", label: "M20 = M20*1.5" },
        { value: "M14", label: "M14 = M14*1.5" },
        { value: "M10", label: "M10 = M10*1" },
        { value: "U", label: "U = 7/16-20UNF External thread" },
        { value: "R", label: "R = R1/4" },
      ],
      cableLength: [
        { value: "1", label: "1.0 = 1m" },
        { value: "2", label: "2.0 = 2m" },
        { value: "3", label: "3.0 = 3m" },
      ],
    },
  },
  {
    id: "level",
    name: "Level Measuring",
    icon: "Ruler",
    description: "Sensors for measuring fluid levels",
    specifications: {
      model: [
        { value: "TxSL20", label: "TxSL20 - Submersible Liquid Level Tranducer" },
        { value: "TxSL22", label: "TxSL22 - Liquid Temperature and Level 2 in 1 Tranducer" },
      ],
      range: [{ value: "200", label: "0-0.5...200mH2O" }],
      tempRange: [{ value: "100", label: "-20~100°C" }],
      output: [
        { value: "A", label: "4-20mA (Two-wired)" },
        { value: "V0", label: "0.5-4.5V (Three-wired)" },
        { value: "V5", label: "0-5V (Three-wired)" },
        { value: "V10", label: "V10 = 0-10V (Three-wired)" },
        { value: "RS", label: "RS = RS485" },
      ],
      unit: [
        { value: "M", label: "M=Meter" },
        { value: "CM", label: "CM=Centimeter" },
      ],
      accuracy: [{ value: "0.5", label: "0.5 = 0.5%F.S." }],
      electricalConnection: [
        { value: "M", label: "M=Directly outlet" },
        { value: "M12", label: "M=M12 waterproof outlet" },
      ],
      display: [
        { value: "1", label: "N=Without display" },
        { value: "2", label: "D2=Explosion-proof digital display type" },
      ],
      cableLength: [
        { value: "1", label: "1.0 = 1m" },
        { value: "2", label: "2.0 = 2m" },
        { value: "3", label: "3.0 = 3m" },
      ],
    },
  },
  {
    id: "flow",
    name: "Flow sensors (Air & liquid)",
    icon: "Download",
    description: "Sensors for measuring flow in air and liquid systems",
    specifications: {
      model: [{ value: "LFS22", label: "LFS22 - Liquid Flow Switch" }],
      connectionSize: [
        { value: "1", label: '1"NPT Size' },
        { value: "2", label: '2/1"NPT' },
        { value: "3", label: '4/3"NPT' },
      ],
      material: [
        { value: "1", label: "Brass (for water or other liquids suitable for brass)" },
        { value: "2", label: "Stainless steel (for ammonia and other liquids suitable for stainless steel)" },
      ],
    },
  },
  {
    id: "smart-thermostat",
    name: "Smart Thermostat",
    icon: "Thermometer",
    description: "Smart thermostats for HVAC control and monitoring",
    specifications: {
      model: [{ value: "VTRM20-XP", label: "VAV (Variable Air Volume) Thermostat-VTRM20-XP" }],
      communication: [
        { value: "1", label: "MOD Modbus RS485" },
        { value: "2", label: "BAC BACnet MS/TP" },
      ],
      interface: [
        { value: "1", label: "No Interface" },
        { value: "2", label: "Colour Capacitive Touchscreen" },
        { value: "3", label: "Bluetooth App Interface" },
        { value: "4", label: "Touchscreen and Bluetooth" },
        { value: "5", label: "LoraWan Wireless Interface, EU868Mhz" },
        { value: "6", label: "LoraWan Wireless Interface EU868MHz with Touchscreen" },
      ],
      measurement: [
        { value: "1", label: "No Extra Measurements" },
        { value: "2", label: "Relative Humidity" },
        { value: "3", label: "Volatile Organic Compound and Humidity" },
        { value: "4", label: "Passive Infrared Movement (PIR)" },
        { value: "5", label: "Relative Humidity and Movement (PIR)" },
        { value: "6", label: "VOC, Relative Humidity and Movement (PIR)" },
      ],
      output: [
        { value: "1", label: "No Output Options" },
        { value: "2", label: "24V Relay Output" },
      ],
      color: [
        { value: "B", label: "Black" },
        { value: "W", label: "White" },
      ],
    },
  },
]

export const sensorModels = {
  "temp-humid": [
    {
      id: "TxTH52",
      name: "Outdoor Temperature and Humidity Transmitter",
      code: "TxTH52",
      imageUrl:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Outdoor%20Temperature%20And%20Humidity%20Tranducer-%20TxTH52.jpg-X4XoYQpq6DlsAE9uDTJsPWRKeRyZSq.jpeg",
    },
    {
      id: "TxTH28N",
      name: "Industrial Temperature and Humidity",
      code: "TxTH28N",
      imageUrl:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Industrial%20Temperature%20And%20Humidity%20%E2%80%93%20TxTH28N.jpg-CqXBBjs5nPnuL16Fd6tfk3NdY4Z9GP.jpeg",
    },
    {
      id: "TxTH91-XP",
      name: "Room Humidity and Temperature Sensor",
      code: "TxTH91-XP",
      imageUrl:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Room%20Humidity%20and%20Temperature%20Sensor-TxTH91-XP-tJoaKxYwhb5Juja25ZaybpltPqVNRy.png",
    },
    {
      id: "TxTHP",
      name: "Temperature and Humidity Sensor Probe",
      code: "TxTHP",
      imageUrl:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Temperature%20and%20Humidity%20Transmitter%20Probe%20TxTHP.jpg-soMjHPm1CiQ1ZGmWW6tWqd0dzaMG2L.jpeg",
    },
    {
      id: "TxT02",
      name: "Air Temperature Transducer",
      code: "TxT02",
      imageUrl:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Air%20Temperature%20Transducer%20%E2%80%93%20TxT02.jpg-IkRdnrbJ84eYEGjb1vsGneNgqHe131.jpeg",
    },
    {
      id: "TxTH28",
      name: "Indoor Temperature Humidity Sensor",
      code: "TxTH28",
      imageUrl:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Indoor%20Temperature%20and%20Humidity%20TxTH28.jpg-Pzy6sc7kbOhjVEcQlXTzQfFcDmzcT0.jpeg",
    },
  ],
  "air-quality": [
    {
      id: "TxCDT380",
      name: "TxCDT380 - Carbon Dioxide (CO2) & Temperature (Wall and Duct)",
      code: "TxCDT380",
      imageUrl:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Carbon%20Dioxide%20(CO2)%20&%20Temperature%20(Wall%20and%20Duct)%20%E2%80%93%20TxCDT-bW0P0uKcZmRzQqIxJz2kb7tIYREC4g.png",
    },
    {
      id: "TxCDW33",
      name: "Wall Mounted CO2 monitor",
      code: "TxCDW33",
      imageUrl:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Wall-Mounted%20Carbon%20Dioxide%20(CO2)%20TxCDW.jpg-M59B02nOrjUlrwlQpyrJvGaSMXUnvr.jpeg",
    },
    {
      id: "TxCDD34",
      name: "Ducted CO2 monitor",
      code: "TxCDD34",
      imageUrl:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Duct%20Carbon%20Dioxide%20(CO2)%20TxCDD.jpg-nlqnZktKGAyxSAIC3GIpabTnU0L2Ip.jpeg",
    },
    {
      id: "TxCDI35",
      name: "Indoor CO2 monitor",
      code: "TxCDI35",
      imageUrl:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Indoor%20Carbon%20Dioxide%20(CO2)%20TxCDI.jpg-IviqvhUdCDPq6TdzX4tAG8931omZRp.jpeg",
    },
    {
      id: "TxDI36",
      name: "Indoor CO2 monitor",
      code: "TxDI36",
      imageUrl:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Indoor%20Carbon%20Dioxide%20(CO2)%20TxCDI.jpg-IviqvhUdCDPq6TdzX4tAG8931omZRp.jpeg",
    },
    {
      id: "TxCOW31",
      name: "Wall-Mounted Carbon Monoxide (CO)",
      code: "TxCOW31",
      imageUrl:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Wall-Mounted%20Carbon%20Monoxide%20(CO)%20TxCOW.jpg-VbtJ0TvmwyP8HcvkEvObXLxHwIgWER.jpeg",
    },
    {
      id: "TxCOI32",
      name: "Indoor Carbon Monoxide (CO)",
      code: "TxCOI32",
      imageUrl:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Indoor%20Carbon%20Monoxide%20Tranducer%20TxCOI8-aCvJSaAwYNJ7RCqszvHWVNas4BWAfw.png",
    },
    {
      id: "TxAQ37",
      name: "All-in-One Air Quality Transducer",
      code: "TxAQ37",
      imageUrl:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/All-In-One%20Air%20Quality%20Transducer%20%E2%80%93%20TxAQ84.jpg-SJ0gsE5JptBp4xM21DNpKVxStplqTD.jpeg",
    },
    {
      id: "AQS820",
      name: "Air Quality Sensor",
      code: "AQS820",
      imageUrl: "https://via.placeholder.com/150",
    },
  ],
  pressure: [
    {
      id: "TXADP12",
      name: "TXADP12",
      code: "TXADP12",
      imageUrl:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Air%20Differential%20Pressure%20Transducer%20%E2%80%93%20TXADP12-hBr5eDLsPUDzmaQC8vCPHifUIzezaU.png",
    },
    {
      id: "DPS52",
      name: "DPS52",
      code: "DPS52",
      imageUrl:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DIfferential%20Pressure%20Transmitter%20%E2%80%93%20DPS52-Xa84RRkKG9w01QPEP1Mse66QZ57KNx.png",
    },
    {
      id: "DPS18",
      name: "DPS18",
      code: "DPS18",
      imageUrl:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Differential%20Pressure%20Switch%20%E2%80%93%20DPS18-oculeL8gDx3NXQgVixMQcUATC0RY46.png",
    },
    {
      id: "TxDP35",
      name: "TxDP35",
      code: "TxDP35",
      imageUrl:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Differential%20Pressure%20Transmitter%20TxDP35-OMGkH7LrdfnlMiB6xVg0qD0qoUPTFa.png",
    },
    {
      id: "TxLDP16",
      name: "TxLDP16",
      code: "TxLDP16",
      imageUrl:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Low%20Differental%20Pressure%20TxLDP16.jpg-iqm92DFlDUdzPnrJeXuUB7MgcDOJmk.jpeg",
    },
  ],
  level: [
    {
      id: "TxSL20",
      name: "TxSL20 - Submersible Liquid Level Tranducer",
      code: "TxSL20",
      imageUrl:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Submersible%20Liquid%20Level%20Transducer%20%E2%80%93%20TxSL20-ayeaYWuP9HzRMiyNvBUfAXDzINh6Iw.png",
    },
    {
      id: "TxSL22",
      name: "TxSL22 - Liquid Temperature and Level 2 in 1 Tranducer",
      code: "TxSL22",
      imageUrl:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Liquid%20Temperature%20and%20Level%202%20in%201%20Tranducer%20%E2%80%93%20TxSL22-ZQEcvHzmuTgUeDkSUYFdZsnT1uKrzs.png",
    },
  ],
  flow: [
    {
      id: "LFS22",
      name: "Liquid Flow Switch",
      code: "LFS22",
      imageUrl:
        "https://neowave.tech/wp-content/uploads/elementor/thumbs/12-qkgpb7ejncs7po2jjlqsqrwsm2oevfoj8j5cw9zek0.png",
    },
  ],
  "smart-thermostat": [
    {
      id: "VTRM20-XP",
      name: "VAV (Variable Air Volume) controllers",
      code: "VTRM20-XP",
      imageUrl:
        "https://neowave.tech/wp-content/uploads/elementor/thumbs/Untitled-1_0010_Vector-Smart-Object-quwmva6axxwte55lkh4jm0ibj62wsuz3smax4zplrk.jpg",
    },
  ],
  "industrial-switches": [
    {
      id: "EDS205",
      name: "5-port Industrial Ethernet Switch",
      code: "EDS205",
      imageUrl: "https://neowave.tech/wp-content/uploads/2024/02/5-port-Industrial-Ethernet-Switch-EDS205.jpg",
      specifications: {
        ports: [{ value: "5", label: "5 Ports" }],
        type: [{ value: "1", label: "Unmanaged" }],
        powerSupply: [{ value: "1", label: "12-48VDC" }],
      },
    },
  ],
}

export const modelSpecifications = {
  TxTH52: {
    name: "Outdoor Temperature and Humidity Transmitter",
    generateCode: (specs: Record<string, string>) => {
      return `TxTH52-${specs.accuracy}-${specs.humidityOutput}-${specs.temperatureOutput}-${specs.temperatureRange}`
    },
    availableOptions: {
      accuracy: ["3"],
      humidityOutput: ["V10", "A", "RS"],
      temperatureOutput: ["V10", "A", "RS", "1", "2", "3", "4"],
      temperatureRange: ["1", "2", "9"],
    },
  },
  TxTH28N: {
    name: "Industrial Temperature and Humidity",
    generateCode: (specs: Record<string, string>) => {
      return `TxTH28N-${specs.accuracy}-${specs.humidityOutput}-${specs.temperatureOutput}-${specs.temperatureRange}-${specs.display}`
    },
    availableOptions: {
      accuracy: ["3"],
      humidityOutput: ["V10", "A", "RS"],
      temperatureOutput: ["V10", "A", "RS", "1", "2", "3", "4"],
      temperatureRange: ["1", "2", "9"],
      display: ["1", "2"],
    },
  },
  "TxTH91-XP": {
    name: "Room Humidity and Temperature Sensor",
    generateCode: (specs: Record<string, string>) => {
      return `TxTH91-XP-${specs.communication}-${specs.interface}-${specs.color}`
    },
    availableOptions: {
      communication: [
        { value: "1", label: "MOD Modbus RS485" },
        { value: "2", label: "BAC BACnet MS/TP" },
      ],
      interface: [
        { value: "1", label: "No Interface" },
        { value: "2", label: "Colour Display" },
      ],
      color: [
        { value: "B", label: "Black" },
        { value: "W", label: "White" },
      ],
    },
  },
  TxTHP: {
    name: "Temperature and Humidity Sensor Probe",
    generateCode: (specs: Record<string, string>) => {
      return `TxTHP-${specs.accuracy}-${specs.humidityOutput}-${specs.temperatureOutput}-${specs.temperatureRange}`
    },
    availableOptions: {
      accuracy: [{ value: "3", label: "±3%RH(0.3)" }],
      humidityOutput: [
        { value: "V10", label: "0-10VDC(Three-wired)" },
        { value: "RS", label: "RS485/Modbus" },
      ],
      temperatureOutput: [
        { value: "V10", label: "0-10VDC(Three-wired)" },
        { value: "RS", label: "RS485/Modbus" },
      ],
      temperatureRange: [
        { value: "0", label: "None" },
        { value: "1", label: "0-50" },
        { value: "2", label: "-20-60" },
        { value: "9", label: "Others (customer specified)" },
      ],
    },
  },
  TxT02: {
    name: "Air Temperature Transducer",
    generateCode: (specs: Record<string, string>) => {
      let baseCode = `TxT02${specs.model}`
      if (specs.temperatureOutput) baseCode += `-${specs.temperatureOutput}`
      if (specs.temperatureRange) baseCode += `-${specs.temperatureRange}`
      if (specs.probeLength) baseCode += `-${specs.probeLength}`
      return baseCode
    },
    availableOptions: {
      model: [
        { value: "S", label: "Separated type" },
        { value: "C", label: "Clamp type" },
        { value: "W", label: "Wall-mounted" },
        { value: "D", label: "Duct type" },
        { value: "P", label: "Tube type/water pipe type temperature transmitter" },
      ],
      temperatureOutput: [
        { value: "V10", label: "10-0VDC(3 wire)" },
        { value: "A", label: "20-4mA(2 wire)" },
        { value: "V5", label: "5-0VDC(3 wire)" },
        { value: "1", label: "PT0.2k/100°C@25°C" },
        { value: "2", label: "PT0.2k, 100°C@25°C" },
        { value: "3", label: "NTC20K, ±0.4°C@25°C" },
        { value: "4", label: "NI 0.4s, 100°C@25°C" },
        { value: "5", label: "NTC10K-II, ±0.4°C@25°C" },
        { value: "6", label: "NTC10K-III, ±0.4°C@25°C" },
        { value: "7", label: "NTC10K-A, ±0.4°C@25°C" },
      ],
      temperatureRange: [
        { value: "0", label: "none" },
        { value: "1", label: "0-50°C" },
        { value: "2", label: "-20-60°C" },
        { value: "9", label: "customized" },
      ],
      probeLength: [
        { value: "0", label: "65MM" },
        { value: "1", label: "100MM" },
        { value: "2", label: "200MM" },
        { value: "3", label: "150MM" },
        { value: "9", label: "customized" },
      ],
    },
  },
  TxTH28: {
    name: "Indoor Temperature Humidity Sensor",
    generateCode: (specs: Record<string, string>) => {
      return `TxTH28-${specs.accuracy}-${specs.humidityOutput}-${specs.temperatureOutput}-${specs.temperatureRange}-${specs.display}`
    },
    availableOptions: {
      accuracy: [{ value: "3", label: "±3%RH(±0.3℃)" }],
      humidityOutput: [
        { value: "A", label: "4-20mA(Two-wired)" },
        { value: "V10", label: "0-10VDC(Three-wired)" },
        { value: "RS", label: "RS485/Modbus" },
        { value: "N", label: "No output" },
      ],
      temperatureOutput: [
        { value: "A", label: "4-20mA(Two-wired)" },
        { value: "V10", label: "0-10VDC(Three-wired)" },
        { value: "RS", label: "RS485/Modbus" },
        { value: "1", label: "PT1000C±0.2C@0C" },
        { value: "2", label: "PT100C±0.2C@0C" },
        { value: "3", label: "NTC20KC±0.4C@25C" },
        { value: "5", label: "NTC10K±0.4C@25C" },
        { value: "N", label: "No output" },
      ],
      temperatureRange: [
        { value: "0", label: "Non" },
        { value: "1", label: "0-50C" },
        { value: "2", label: "-20-60" },
        { value: "9", label: "Customizable" },
      ],
      display: [
        { value: "1", label: "Without display" },
        { value: "2", label: "LCD digital display" },
      ],
    },
  },
  TxCOI32: {
    name: "Indoor carbon monoxide transducer",
    generateCode: (specs: Record<string, string>) => {
      return `TxCOI32-${specs.measureRange}-${specs.output}-${specs.display}-${specs.relay}`
    },
    availableOptions: {
      measureRange: "CO",
      output: ["AV", "RS"],
      display: ["1", "2"],
      relay: ["1", "2"],
    },
  },
  TxAQ37: {
    name: "ALL-IN-ONE AIR QUALITY TRANDUCER",
    generateCode: (specs: Record<string, string>) => {
      return `TxAQ37-${specs.installation}-${specs.tempRH}-${specs.co2}-${specs.pm}-${specs.voc}-${specs.formaldehyde}-${specs.outputType}-${specs.display}-${specs.indicationLight}`
    },
    availableOptions: {
      installation: ["1", "2"],
      tempRH: ["1", "2"],
      co2: ["1", "2"],
      pm: ["1", "2"],
      voc: ["1", "2"],
      formaldehyde: ["1", "2"],
      outputType: ["RSN", "RS"],
      display: ["1", "2"],
      indicationLight: ["1", "2"],
    },
  },
  TxCDT380: {
    name: "Carbon Dioxide (CO2) & Temperature (Wall and Duct) – TxCDT380",
    generateCode: (specs: Record<string, string>) => {
      return `TxCDT380-${specs.co2Output}-${specs.tempOutput}-${specs.display}`
    },
    availableOptions: {
      co2Output: ["VA", "RS"],
      tempOutput: ["VA", "1", "2", "3", "4", "5", "6", "7", "RS"],
      display: ["1", "2"],
    },
  },
  TxCOW31: {
    name: "Wall mounted electrochemical CO sensor",
    generateCode: (specs: Record<string, string>) => {
      return `TxCOW31-${specs.measureRange}-${specs.output}`
    },
    availableOptions: {
      measureRange: [
        { value: "1", label: "500ppm" },
        { value: "2", label: "1000ppm" },
      ],
      output: [
        { value: "V5", label: "0-5V" },
        { value: "V10", label: "0-10V" },
        { value: "A", label: "4-20mA" },
        { value: "RS", label: "RS485/Modbus" },
      ],
    },
  },
  TxCDI35: {
    name: "Indoor CO2 monitor",
    generateCode: (specs: Record<string, string>) => {
      return `TxCDI35-${specs.measureRange}-${specs.output}-${specs.display}`
    },
    availableOptions: {
      measureRange: [
        { value: "2", label: "2000ppm" },
        { value: "5", label: "5000ppm" },
      ],
      output: [
        { value: "V5", label: "0-5V" },
        { value: "V10", label: "0-10V" },
        { value: "A", label: "4-20mA" },
        { value: "RS", label: "RS485/Modbus" },
      ],
      display: [
        { value: "1", label: "Without digital display" },
        { value: "2", label: "With digital display" },
      ],
    },
  },
  TxCDD34: {
    name: "Ducted CO2 monitor",
    generateCode: (specs: Record<string, string>) => {
      return `TxCDD34-${specs.measureRange}-${specs.output}`
    },
    availableOptions: {
      measureRange: [
        { value: "2", label: "2000ppm" },
        { value: "5", label: "5000ppm" },
      ],
      output: [
        { value: "5V", label: "0-5V" },
        { value: "10V", label: "0-10V" },
        { value: "A", label: "4-20mA" },
        { value: "RS", label: "RS485" },
      ],
    },
  },
  TXADP12: {
    name: "Air Differential Pressure Transducer",
    generateCode: (specs: Record<string, string>) => {
      return `TXADP12-${specs.pressureRange}-${specs.display}-${specs.output}`
    },
    availableOptions: {
      pressureRange: [
        { value: "2", label: "-100~100pa" },
        { value: "4", label: "-1000~1000Pa" },
        { value: "6", label: "-10000~10000Pa" },
      ],
      display: [
        { value: "1", label: "Without Display" },
        { value: "2", label: "With Display" },
      ],
      output: [
        { value: "AV", label: "4-20mA/0-10VDC (Simultaneous output)" },
        { value: "A", label: "4-20mA (Two-wired)" },
        { value: "V10", label: "0-10VDC (Three-wired)" },
        { value: "V5", label: "0-5VDC (Three-wired)" },
        { value: "RS", label: "RS-485 communication" },
        { value: "RSW", label: "RS-485 communication (with isolation)" },
      ],
    },
  },
  DPS52: {
    name: "Differential Pressure Switch",
    generateCode: (specs: Record<string, string>) => {
      return `DPS52-${specs.connectorMaterial}-${specs.connectorThread}-${specs.wiring}`
    },
    availableOptions: {
      connectorMaterial: ["1", "2"],
      connectorThread: ["1", "2", "3", "4", "5", "6", "7"],
      wiring: ["1", "2"],
    },
  },
  DPS18: {
    name: "Differential Pressure Switch",
    generateCode: (specs: Record<string, string>) => {
      return `DPS18-${specs.pressureRange}`
    },
    availableOptions: {
      pressureRange: [
        { value: "01", label: "20-200 Pa" },
        { value: "02", label: "30-300 Pa" },
        { value: "03", label: "40-400 Pa" },
        { value: "04", label: "50-500 Pa" },
        { value: "05", label: "200-1000 Pa" },
        { value: "06", label: "100-1000 Pa" },
        { value: "07", label: "500-2500 Pa" },
        { value: "08", label: "1000-5000 Pa" },
      ],
    },
  },
  TxDP35: {
    name: "Differential Pressure Transmitter",
    generateCode: (specs: Record<string, string>) => {
      return `TxDP35-${specs.output}-${specs.unit}-${specs.accuracy}-${specs.electricalConnection}-${specs.pressureConnection}-${specs.cableLength}`
    },
    availableOptions: {
      output: ["A", "V10", "RS"],
      unit: ["K", "P", "B", "M"],
      accuracy: ["0.25", "0.5"],
      electricalConnection: ["D", "M", "C3", "C4", "H"],
      pressureConnection: ["G", "N", "G2", "M20", "M14", "M10", "U", "R"],
      cableLength: ["1", "2", "3"],
    },
  },
  TxLDP16: {
    name: "Low Differential Pressure Transducer",
    generateCode: (specs: Record<string, string>) => {
      return `TxLDP16-${specs.pressureRange}-${specs.output}`
    },
    availableOptions: {
      pressureRange: [
        { value: "101D", label: "0±100Pa (two-way)" },
        { value: "101G", label: "0-100Pa (one-way)" },
        { value: "102D", label: "0±1000Pa" },
        { value: "102G", label: "0-1000Pa" },
        { value: "251D", label: "0±250Pa" },
        { value: "251G", label: "0-250Pa" },
        { value: "252D", label: "0±2500Pa" },
        { value: "252G", label: "0-2500Pa" },
        { value: "051D", label: "0±50Pa" },
        { value: "051G", label: "0-50Pa" },
        { value: "501D", label: "0±500Pa" },
        { value: "501G", label: "0-500Pa" },
        { value: "502D", label: "0±5000Pa" },
        { value: "502G", label: "0-5000Pa" },
        { value: "103D", label: "0±10000Pa" },
      ],
      output: [
        { value: "A", label: "4-20mA (Two-wired)" },
        { value: "V10", label: "0-10VDC (Three-wired)" },
        { value: "V5", label: "0-5VDC (Three-wired)" },
        { value: "RS", label: "RS485" },
        { value: "RsV10", label: "RS485, 0-10VDC" },
        { value: "RsV5", label: "RS485, 0-5VDC" },
        { value: "RsA", label: "RS485, 4-20mA" },
      ],
    },
  },
  TxSL20: {
    name: "Submersible Liquid Level Tranducer",
    generateCode: (specs: Record<string, string>) => {
      return `TxSL20-${specs.output}-${specs.unit}-${specs.accuracy}-${specs.electricalConnection}-${specs.display}-${specs.cableLength}`
    },
    availableOptions: {
      output: ["A", "V0", "V5", "V10", "RS"],
      unit: ["M", "CM"],
      accuracy: ["0.5"],
      electricalConnection: ["M"],
      display: ["1", "2"],
      cableLength: ["1", "2"],
    },
  },
  TxSL22: {
    name: "Liquid Temperature and Level 2 in 1 Tranducer",
    generateCode: (specs: Record<string, string>) => {
      return `TxSL22-${specs.output}-${specs.unit}-${specs.accuracy}-${specs.electricalConnection}-${specs.cableLength}`
    },
    availableOptions: {
      output: [
        { value: "A", label: "4-20mA" },
        { value: "V0", label: "0.5-4.5V" },
        { value: "RS", label: "RS485" },
      ],
      unit: [
        { value: "M", label: "M=Meter" },
        { value: "CM", label: "CM=Centimeter" },
      ],
      accuracy: [{ value: "0.5", label: "0.5 = 0.5%F.S." }],
      electricalConnection: [{ value: "M", label: "M=M12 waterproof outlet" }],
      cableLength: [
        { value: "1", label: "1.0=1m" },
        { value: "2", label: "2.0=2m" },
        { value: "3", label: "3.0=3m" },
      ],
      range: [{ value: "200", label: "0~1...200mH2O" }],
      tempRange: [{ value: "100", label: "-20~100°C" }],
    },
  },
  TxCDW33: {
    name: "Wall Mounted CO2 monitor",
    generateCode: (specs: Record<string, string>) => {
      return `TxCDW33-${specs.measureRange}-${specs.output}`
    },
    availableOptions: {
      measureRange: [
        { value: "2", label: "2000ppm" },
        { value: "5", label: "5000ppm" },
        { value: "10", label: "10000ppm" },
      ],
      output: [
        { value: "V5", label: "0-5V" },
        { value: "v10", label: "0-10V" },
        { value: "A", label: "4-20mA" },
        { value: "RS", label: "RS485/Modbus" },
      ],
    },
  },
  AQS820: {
    name: "Air Quality Sensor",
    generateCode: (specs: Record<string, string>) => {
      return `AQS820-${specs.output}`
    },
    availableOptions: {
      output: [
        { value: "V5", label: "0-5V" },
        { value: "V10", label: "0-10V" },
        { value: "A", label: "4-20mA" },
        { value: "RS", label: "RS485/Modbus" },
      ],
    },
  },
  LFS22: {
    name: "Liquid Flow Switch",
    generateCode: (specs: Record<string, string>) => {
      return `LFS22-${specs.connectionSize}-${specs.material}`
    },
    availableOptions: {
      connectionSize: [
        { value: "1", label: '1"NPT Size' },
        { value: "2", label: '2/1"NPT' },
        { value: "3", label: '4/3"NPT' },
      ],
      material: [
        { value: "1", label: "Brass (for water or other liquids suitable for brass)" },
        { value: "2", label: "Stainless steel (for ammonia and other liquids suitable for stainless steel)" },
      ],
    },
  },
  "VTRM20-XP": {
    name: "VAV (Variable Air Volume) controllers",
    generateCode: (specs: Record<string, string>) => {
      return `VTRM20-XP-${specs.communication}-${specs.interface}-${specs.measurement}-${specs.output}-${specs.color}`
    },
    availableOptions: {
      communication: [
        { value: "1", label: "MOD Modbus RS485" },
        { value: "2", label: "BAC BACnet MS/TP" },
      ],
      interface: [
        { value: "1", label: "No Interface" },
        { value: "2", label: "Colour Capacitive Touchscreen" },
        { value: "3", label: "Bluetooth App Interface" },
        { value: "4", label: "Touchscreen and Bluetooth" },
        { value: "5", label: "LoraWan Wireless Interface, EU868Mhz" },
        { value: "6", label: "LoraWan Wireless Interface EU868MHz with Touchscreen" },
      ],
      measurement: [
        { value: "1", label: "No Extra Measurements" },
        { value: "2", label: "Relative Humidity" },
        { value: "3", label: "Volatile Organic Compound and Humidity" },
        { value: "4", label: "Passive Infrared Movement (PIR)" },
        { value: "5", label: "Relative Humidity and Movement (PIR)" },
        { value: "6", label: "VOC, Relative Humidity and Movement (PIR)" },
      ],
      output: [
        { value: "1", label: "No Output Options" },
        { value: "2", label: "24V Relay Output" },
      ],
      color: [
        { value: "B", label: "Black" },
        { value: "W", label: "White" },
      ],
    },
  },
  EDS205: {
    name: "5-port Industrial Ethernet Switch",
    generateCode: (specs: Record<string, string>) => {
      return `EDS205-${specs.ports}-${specs.type}-${specs.powerSupply}`
    },
    availableOptions: {
      ports: [{ value: "5", label: "5 Ports" }],
      type: [{ value: "1", label: "Unmanaged" }],
      powerSupply: [{ value: "1", label: "12-48VDC" }],
    },
    description: "5-port industrial unmanaged Ethernet switch with 12-48VDC power supply",
  },
  getCustomSpecs: getCustomProductSpecifications,
}

