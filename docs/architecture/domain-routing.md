# Domain routing

The root application is prepared to become a gateway later.

## Current behavior

- `egohygiene.io/` serves the public website
- future product paths such as `/mindcap` and `/renderflow` resolve locally to status pages

## Future direction

- `egohygiene.io/<product>` can later route to independently deployed product websites
- the root repository remains the place where shared product metadata and path ownership are defined
