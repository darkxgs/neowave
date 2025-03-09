interface ProductCodeFormatProps {
  model: string
  specifications: Record<string, any>
}

export function ProductCodeFormat({ model, specifications }: ProductCodeFormatProps) {
  const getSpecificationTable = () => {
    switch (model) {
      case "TxTH91-XP":
        return (
          <div className="grid gap-4 bg-[#1B2531] rounded-lg p-6">
            <div className="grid grid-cols-2 items-center border-b border-[#2a3744] pb-4">
              <div className="text-[#40C4FF] font-medium">TxTH91-XP</div>
              <div className="text-gray-300">Room Humidity and Temperature Sensor</div>
            </div>

            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
              <div>
                <div className="text-[#40C4FF] font-medium mb-2">Communication</div>
                <div className="grid gap-2">
                  <div className="flex justify-between text-gray-300">
                    <span>1</span>
                    <span>MOD Modbus RS485</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>2</span>
                    <span>BAC BACnet MS/TP</span>
                  </div>
                </div>
              </div>

              <div>
                <div className="text-[#40C4FF] font-medium mb-2">Interface</div>
                <div className="grid gap-2">
                  <div className="flex justify-between text-gray-300">
                    <span>1</span>
                    <span>No Interface</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>2</span>
                    <span>Colour Display</span>
                  </div>
                </div>
              </div>

              <div>
                <div className="text-[#40C4FF] font-medium mb-2">Color</div>
                <div className="grid gap-2">
                  <div className="flex justify-between text-gray-300">
                    <span>B</span>
                    <span>Black</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>W</span>
                    <span>White</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      case "TxTH28":
        return (
          <div className="grid gap-4 bg-[#1B2531] rounded-lg p-6">
            <div className="grid grid-cols-2 items-center border-b border-[#2a3744] pb-4">
              <div className="text-[#40C4FF] font-medium">TxTH28</div>
              <div className="text-gray-300">Indoor Temperature Humidity Sensor</div>
            </div>

            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
              <div>
                <div className="text-[#40C4FF] font-medium mb-2">Accuracy</div>
                <div className="grid gap-2">
                  <div className="flex justify-between text-gray-300">
                    <span>3</span>
                    <span>±3%RH(±0.3℃)</span>
                  </div>
                </div>
              </div>

              <div>
                <div className="text-[#40C4FF] font-medium mb-2">Humidity Output</div>
                <div className="grid gap-2">
                  <div className="flex justify-between text-gray-300">
                    <span>A</span>
                    <span>4-20mA(Two-wired)</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>V10</span>
                    <span>0-10VDC(Three-wired)</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>RS</span>
                    <span>RS485/Modbus</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>N</span>
                    <span>No output</span>
                  </div>
                </div>
              </div>

              <div>
                <div className="text-[#40C4FF] font-medium mb-2">Temperature Output</div>
                <div className="grid gap-2">
                  <div className="flex justify-between text-gray-300">
                    <span>A</span>
                    <span>4-20mA(Two-wired)</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>V10</span>
                    <span>0-10VDC(Three-wired)</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>RS</span>
                    <span>RS485/Modbus</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>1</span>
                    <span>PT1000C±0.2C@0C</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>2</span>
                    <span>PT100C±0.2C@0C</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>3</span>
                    <span>NTC20KC±0.4C@25C</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>5</span>
                    <span>NTC10K±0.4C@25C</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>N</span>
                    <span>No output</span>
                  </div>
                </div>
              </div>

              <div>
                <div className="text-[#40C4FF] font-medium mb-2">Range</div>
                <div className="grid gap-2">
                  <div className="flex justify-between text-gray-300">
                    <span>0</span>
                    <span>Non</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>1</span>
                    <span>0-50C</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>2</span>
                    <span>-20-60</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>9</span>
                    <span>Customizable</span>
                  </div>
                </div>
              </div>

              <div>
                <div className="text-[#40C4FF] font-medium mb-2">Display</div>
                <div className="grid gap-2">
                  <div className="flex justify-between text-gray-300">
                    <span>1</span>
                    <span>Without display</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>2</span>
                    <span>LCD digital display</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return <div className="mt-8">{getSpecificationTable()}</div>
}

