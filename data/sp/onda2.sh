#!/bin/zsh
cd ~/Documents/match-eleitoral
while pgrep -f "claude -p" > /dev/null; do sleep 30; done
for t in sp_fed_novos sp_est_inc_a sp_est_inc_b sp_est_novos; do
  nohup env CLAUDE_CODE_MAX_WEB_SEARCHES_PER_SESSION=1500 claude -p "$(cat data/sp/prompts/$t.txt)" --permission-mode bypassPermissions --output-format json > data/sp/logs/$t.json 2> data/sp/logs/$t.err < /dev/null &
done
echo "onda 2 iniciada $(date)" > data/sp/logs/onda2.started
