osascript 2>/dev/null <<EOF
	tell application "System Events"
		tell process "Terminal" to keystroke "t" using command down
	end
	delay 1
	tell application "Terminal"
		do script with command "cd \"$PWD\" && cd ../../ && ./runtime/cluster8 configs/networked/thread1.json /apps/$1 " in front window
	end tell
EOF
