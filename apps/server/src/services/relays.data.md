# USB Relay — Hardware Enumeration Data

Raw output from macOS USB enumeration tools, captured Dec 6, 2025.
Two USBRelay8 boards connected simultaneously (Vendor `0x16c0`, Product `0x05df`).
See also: `/docs/relays/hardware.md`

---

## system_profiler SPUSBDataType



            USBRelay8:

              Product ID: 0x05df
              Vendor ID: 0x16c0
              Version: 1.00
              Speed: Up to 1.5 Mb/s
              Manufacturer: www.dcttech.com
              Location ID: 0x08320000 / 5
              Current Available (mA): 500
              Current Required (mA): 20
              Extra Operating Current (mA): 0

            USBRelay8:

              Product ID: 0x05df
              Vendor ID: 0x16c0
              Version: 1.00
              Speed: Up to 1.5 Mb/s
              Manufacturer: www.dcttech.com
              Location ID: 0x08310000 / 6
              Current Available (mA): 500
              Current Required (mA): 20
              Extra Operating Current (mA): 0




---

## ioreg -p IOUSB -l -w 0



      |
      +-o USBRelay8@08320000  <class IOUSBHostDevice, id 0x100005535, registered, matched, active, busy 0 (36 ms), retain 30>
      |   {
      |     "sessionID" = 107519349378
      |     "USBSpeed" = 2
      |     "idProduct" = 1503
      |     "iManufacturer" = 1
      |     "bDeviceClass" = 0
      |     "IOPowerManagement" = {"PowerOverrideOn"=Yes,"DevicePowerState"=2,"CurrentPowerState"=2,"CapabilityFlags"=32768,"MaxPowerState"=2,"DriverPowerState"=0}
      |     "bcdDevice" = 256
      |     "bMaxPacketSize0" = 8
      |     "iProduct" = 2
      |     "iSerialNumber" = 0
      |     "bNumConfigurations" = 1
      |     "UsbDeviceSignature" = <c016df050001000000030000>
      |     "USB Product Name" = "USBRelay8"
      |     "locationID" = 137494528
      |     "bDeviceSubClass" = 0
      |     "bcdUSB" = 272
      |     "USB Address" = 5
      |     "kUSBCurrentConfiguration" = 1
      |     "IOCFPlugInTypes" = {"9dc7b780-9ec0-11d4-a54f-000a27052861"="IOUSBHostFamily.kext/Contents/PlugIns/IOUSBLib.bundle"}
      |     "bDeviceProtocol" = 0
      |     "USBPortType" = 0
      |     "IOServiceDEXTEntitlements" = (("com.apple.developer.driverkit.transport.usb"))
      |     "USB Vendor Name" = "www.dcttech.com"
      |     "Device Speed" = 0
      |     "idVendor" = 5824
      |     "kUSBProductString" = "USBRelay8"
      |     "IOGeneralInterest" = "IOCommand is not serializable"
      |     "kUSBAddress" = 5
      |     "kUSBVendorString" = "www.dcttech.com"
      |   }
      |
      +-o USBRelay8@08310000  <class IOUSBHostDevice, id 0x10000554a, registered, matched, active, busy 0 (40 ms), retain 30>
          {
            "sessionID" = 107592370959
            "USBSpeed" = 2
            "idProduct" = 1503
            "iManufacturer" = 1
            "bDeviceClass" = 0
            "IOPowerManagement" = {"PowerOverrideOn"=Yes,"DevicePowerState"=2,"CurrentPowerState"=2,"CapabilityFlags"=32768,"MaxPowerState"=2,"DriverPowerState"=0}
            "bcdDevice" = 256
            "bMaxPacketSize0" = 8
            "iProduct" = 2
            "iSerialNumber" = 0
            "bNumConfigurations" = 1
            "UsbDeviceSignature" = <c016df050001000000030000>
            "USB Product Name" = "USBRelay8"
            "locationID" = 137428992
            "bDeviceSubClass" = 0
            "bcdUSB" = 272
            "USB Address" = 6
            "kUSBCurrentConfiguration" = 1
            "IOCFPlugInTypes" = {"9dc7b780-9ec0-11d4-a54f-000a27052861"="IOUSBHostFamily.kext/Contents/PlugIns/IOUSBLib.bundle"}
            "bDeviceProtocol" = 0
            "USBPortType" = 0
            "IOServiceDEXTEntitlements" = (("com.apple.developer.driverkit.transport.usb"))
            "USB Vendor Name" = "www.dcttech.com"
            "Device Speed" = 0
            "idVendor" = 5824
            "kUSBProductString" = "USBRelay8"
            "IOGeneralInterest" = "IOCommand is not serializable"
            "kUSBAddress" = 6
            "kUSBVendorString" = "www.dcttech.com"
          }
