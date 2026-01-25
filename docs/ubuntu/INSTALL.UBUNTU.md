# Connect to Pi4 from macOS via samba

On macOS, use `mount_smbfs` instead of `mount -t cifs`. Correct syntax:

[1 tool called]

Use this macOS syntax:

```bash
# Create mount point if it doesn't exist
mkdir -p ~/Public/touch

# Mount using mount_smbfs (macOS native SMB client)
sudo mount_smbfs //touch:1234@192.168.1.31/touch ~/Public/touch
```

Or with more options:

```bash
sudo mount_smbfs -o uid=$(id -u),gid=$(id -g) //touch:1234@192.168.1.31/touch ~/Public/touch
```

**Notes:**

1. Use `mount_smbfs` instead of `mount -t cifs` on macOS
2. Format: `//username:password@server/share`
3. The IP address should be `192.168.1.31` (not 192.168.1.100)
4. Make sure the share name matches what you configured in Samba

**To unmount:**

```bash
sudo umount ~/Public/touch
```

**Alternative: Use Finder (easier)**

1. Open Finder
2. Press `Cmd + K` (or Go → Connect to Server)
3. Enter: `smb://192.168.1.31`
4. Authenticate with username `touch` and password `1234`
5. Select the `touch` share

Finder is usually easier on macOS. If you prefer command line, use `mount_smbfs` with the syntax above.
