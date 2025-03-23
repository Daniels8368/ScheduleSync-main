from ics import Calendar, Event

def generate_ics(details):
    c = Calendar()
    e = Event()
    e.name = details['title']
    e.begin = details['start']
    e.end = details['end']
    c.events.add(e)

    with open("event.ics", "w") as f:
        f.writelines(c)
    return "/event.ics"

def analyze_ics(file):
    c = Calendar(file.read().decode('utf-8'))
    events = [(e.name, e.begin) for e in c.events]
    return {"events": events}