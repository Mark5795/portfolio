For Raspberry Pi OS (Bookworm / Trixie / rpi-swap)
Open the swap configuration file:
```bash
sudo nano /etc/rpi/swap.conf
```
Find the line `Mechanism=auto` (or `#Mechanism=auto`) and change it to:
```text
Mechanism=none
```
Save and exit (Ctrl+O, Enter, then Ctrl+X).
Reboot your device to apply changes:
```bash
sudo reboot
```


