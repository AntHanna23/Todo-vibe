# Snapshot file
# Unset all aliases to avoid conflicts with functions
unalias -a 2>/dev/null || true
# Functions
eval "$(echo 'Z2F3a2xpYnBhdGhfYXBwZW5kICgpIAp7IAogICAgWyAteiAiJEFXS0xJQlBBVEgiIF0gJiYgQVdL
TElCUEFUSD1gZ2F3ayAnQkVHSU4ge3ByaW50IEVOVklST05bIkFXS0xJQlBBVEgiXX0nYDsKICAg
IGV4cG9ydCBBV0tMSUJQQVRIPSIkQVdLTElCUEFUSDokKiIKfQo=' | base64 -d)" > /dev/null 2>&1
eval "$(echo 'Z2F3a2xpYnBhdGhfZGVmYXVsdCAoKSAKeyAKICAgIHVuc2V0IEFXS0xJQlBBVEg7CiAgICBleHBv
cnQgQVdLTElCUEFUSD1gZ2F3ayAnQkVHSU4ge3ByaW50IEVOVklST05bIkFXS0xJQlBBVEgiXX0n
YAp9Cg==' | base64 -d)" > /dev/null 2>&1
eval "$(echo 'Z2F3a2xpYnBhdGhfcHJlcGVuZCAoKSAKeyAKICAgIFsgLXogIiRBV0tMSUJQQVRIIiBdICYmIEFX
S0xJQlBBVEg9YGdhd2sgJ0JFR0lOIHtwcmludCBFTlZJUk9OWyJBV0tMSUJQQVRIIl19J2A7CiAg
ICBleHBvcnQgQVdLTElCUEFUSD0iJCo6JEFXS0xJQlBBVEgiCn0K' | base64 -d)" > /dev/null 2>&1
eval "$(echo 'Z2F3a3BhdGhfYXBwZW5kICgpIAp7IAogICAgWyAteiAiJEFXS1BBVEgiIF0gJiYgQVdLUEFUSD1g
Z2F3ayAnQkVHSU4ge3ByaW50IEVOVklST05bIkFXS1BBVEgiXX0nYDsKICAgIGV4cG9ydCBBV0tQ
QVRIPSIkQVdLUEFUSDokKiIKfQo=' | base64 -d)" > /dev/null 2>&1
eval "$(echo 'Z2F3a3BhdGhfZGVmYXVsdCAoKSAKeyAKICAgIHVuc2V0IEFXS1BBVEg7CiAgICBleHBvcnQgQVdL
UEFUSD1gZ2F3ayAnQkVHSU4ge3ByaW50IEVOVklST05bIkFXS1BBVEgiXX0nYAp9Cg==' | base64 -d)" > /dev/null 2>&1
eval "$(echo 'Z2F3a3BhdGhfcHJlcGVuZCAoKSAKeyAKICAgIFsgLXogIiRBV0tQQVRIIiBdICYmIEFXS1BBVEg9
YGdhd2sgJ0JFR0lOIHtwcmludCBFTlZJUk9OWyJBV0tQQVRIIl19J2A7CiAgICBleHBvcnQgQVdL
UEFUSD0iJCo6JEFXS1BBVEgiCn0K' | base64 -d)" > /dev/null 2>&1
# Shell Options
shopt -u autocd
shopt -u assoc_expand_once
shopt -u cdable_vars
shopt -u cdspell
shopt -u checkhash
shopt -u checkjobs
shopt -s checkwinsize
shopt -s cmdhist
shopt -u compat31
shopt -u compat32
shopt -u compat40
shopt -u compat41
shopt -u compat42
shopt -u compat43
shopt -u compat44
shopt -s complete_fullquote
shopt -u direxpand
shopt -u dirspell
shopt -u dotglob
shopt -u execfail
shopt -u expand_aliases
shopt -u extdebug
shopt -u extglob
shopt -s extquote
shopt -u failglob
shopt -s force_fignore
shopt -s globasciiranges
shopt -s globskipdots
shopt -u globstar
shopt -u gnu_errfmt
shopt -u histappend
shopt -u histreedit
shopt -u histverify
shopt -s hostcomplete
shopt -u huponexit
shopt -u inherit_errexit
shopt -s interactive_comments
shopt -u lastpipe
shopt -u lithist
shopt -u localvar_inherit
shopt -u localvar_unset
shopt -s login_shell
shopt -u mailwarn
shopt -u no_empty_cmd_completion
shopt -u nocaseglob
shopt -u nocasematch
shopt -u noexpand_translation
shopt -u nullglob
shopt -s patsub_replacement
shopt -s progcomp
shopt -u progcomp_alias
shopt -s promptvars
shopt -u restricted_shell
shopt -u shift_verbose
shopt -s sourcepath
shopt -u syslog_history
shopt -u varredir_close
shopt -u xpg_echo
set -o braceexpand
set -o hashall
set -o interactive-comments
set -o monitor
set -o onecmd
shopt -s expand_aliases
# Aliases
alias -- egrep='grep -E --color=auto'
alias -- fgrep='grep -F --color=auto'
alias -- grep='grep --color=auto'
alias -- which='(alias; declare -f) | /usr/bin/which --tty-only --read-alias --read-functions --show-tilde --show-dot'
alias -- xzegrep='xzegrep --color=auto'
alias -- xzfgrep='xzfgrep --color=auto'
alias -- xzgrep='xzgrep --color=auto'
alias -- zegrep='zegrep --color=auto'
alias -- zfgrep='zfgrep --color=auto'
alias -- zgrep='zgrep --color=auto'
# Check for rg availability
if ! (unalias rg 2>/dev/null; command -v rg) >/dev/null 2>&1; then
  function rg {
  if [[ -n $ZSH_VERSION ]]; then
    ARGV0=rg /home/ahanna13/.cursor-server/extensions/anthropic.claude-code-2.1.85-linux-x64/resources/native-binary/claude "$@"
  elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]] || [[ "$OSTYPE" == "win32" ]]; then
    ARGV0=rg /home/ahanna13/.cursor-server/extensions/anthropic.claude-code-2.1.85-linux-x64/resources/native-binary/claude "$@"
  elif [[ $BASHPID != $$ ]]; then
    exec -a rg /home/ahanna13/.cursor-server/extensions/anthropic.claude-code-2.1.85-linux-x64/resources/native-binary/claude "$@"
  else
    (exec -a rg /home/ahanna13/.cursor-server/extensions/anthropic.claude-code-2.1.85-linux-x64/resources/native-binary/claude "$@")
  fi
}
fi
export PATH='/home/ahanna13/.cursor-server/bin/fea2f546c979a0a4ad1deab23552a43568807590/bin/remote-cli:/home/ahanna13/.local/bin:/home/ahanna13/bin:/home/ahanna13/.cursor-server/bin/fea2f546c979a0a4ad1deab23552a43568807590/bin/remote-cli:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games:/usr/lib/wsl/lib:/mnt/c/Program Files/Common Files/Oracle/Java/javapath:/mnt/c/Program Files (x86)/Common Files/Oracle/Java/javapath:/mnt/c/Program Files/Eclipse Adoptium/jdk-21.0.2.13-hotspot/bin:/mnt/c/Windows/system32:/mnt/c/Windows:/mnt/c/Windows/System32/Wbem:/mnt/c/Windows/System32/WindowsPowerShell/v1.0/:/mnt/c/Windows/System32/OpenSSH/:/mnt/c/Program Files (x86)/Pulse Secure/VC142.CRT/X64/:/mnt/c/Program Files (x86)/Pulse Secure/VC142.CRT/X86/:/mnt/c/Program Files (x86)/Common Files/Pulse Secure/TNC Client Plugin/:/mnt/c/Program Files/dotnet/:/mnt/c/Program Files/Git/cmd:/mnt/c/Program Files/Java/jdk-22/bin:/mnt/c/Program Files (x86)/NVIDIA Corporation/PhysX/Common:/mnt/c/Program Files/Vagrant/bin:/mnt/c/Program Files/Docker/Docker/resources/bin:/mnt/c/Program Files/apache-maven-3.9.8/bin:/mnt/c/Program Files/PuTTY/:/mnt/c/Program Files/NVIDIA Corporation/NVIDIA app/NvDLISR:/mnt/c/Users/Anthony/AppData/Local/Programs/cursor/resources/app/codeBin:/mnt/c/Users/Anthony/AppData/Local/Microsoft/WindowsApps:/mnt/c/Users/Anthony/AppData/Local/Programs/Microsoft VS Code/bin:/mnt/c/Program Files/Java/jdk-22/bin:/mnt/c/Program Files/JetBrains/IntelliJ IDEA 2024.1/bin:/mnt/c/Users/Anthony/AppData/Local/Microsoft/WinGet/Packages/Schniz.fnm_Microsoft.Winget.Source_8wekyb3d8bbwe:/mnt/c/Program Files (x86)/Nmap:/mnt/c/Users/Anthony/AppData/Local/Programs/cursor/resources/app/bin'
