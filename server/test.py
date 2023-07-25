from datetime import datetime, timedelta, timezone

posted = datetime.now(timezone.utc).astimezone().strftime("%m-%d-%Y %I:%M:%S %p")

print(posted)