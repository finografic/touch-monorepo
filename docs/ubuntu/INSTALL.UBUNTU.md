# Connect to Raspberry Pi from macOS via Samba

On macOS, use `mount_smbfs` instead of `mount -t cifs`.

Replace `<PI_IP_ADDRESS>`, `<PI_USERNAME>`, and `<PI_PASSWORD>` with your Pi's network details.
Use a strong password — do not reuse example values in production.

## Command line (mount_smbfs)

```bash
# Create mount point if it doesn't exist
mkdir -p ~/Public/touch

# Mount using mount_smbfs (macOS native SMB client)
sudo mount_smbfs //<PI_USERNAME>:<PI_PASSWORD>@<PI_IP_ADDRESS>/touch ~/Public/touch
```

Or with ownership options:

```bash
sudo mount_smbfs -o uid=$(id -u),gid=$(id -g) //<PI_USERNAME>:<PI_PASSWORD>@<PI_IP_ADDRESS>/touch ~/Public/touch
```

**Notes:**

1. Use `mount_smbfs` instead of `mount -t cifs` on macOS
2. Format: `//username:password@server/share`
3. Make sure the share name matches what you configured in Samba

**To unmount:**

```bash
sudo umount ~/Public/touch
```

## Finder (easier on macOS)

1. Open Finder
2. Press `Cmd + K` (or Go → Connect to Server)
3. Enter: `smb://<PI_IP_ADDRESS>`
4. Authenticate with your Pi username and password
5. Select the `touch` share

Finder is usually easier on macOS. If you prefer the command line, use `mount_smbfs` with the syntax above.
