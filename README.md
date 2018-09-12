# Quake Seeds

A tool to help you seed Quake Champion players based on their Elo rating. 

If you're running a Quake Champions tournament, whether on 
Battlefy or just by yourself, every minute counts. Using this tool helps you quickly to determine player seeds based on their Elo rating.

Supports both Battlefy and manual input.

## How it works
How the app works is that it takes in either a Battlefy tournament URL or ID (that is also visible in the URL) or manually added player names.

In the case of Battlefy URL or ID, the app fetches the tournament information and all the registered players and for each player, it uses the [Stats site](https://stats.quake.com)
to get the player ratings. Then it sorts the players from the highest Elo to the lowest in a numerical order, creating our seeds. The app will display both registered and checked-in players
in the same view and a warning will be shown if the check-in has started but not finished, prompting that the results are not final and shouldn't be used.

For manual input the app just takes a list of entered names, which have to be case sensitive due to the nature of how the [Stats site](https://stats.quake.com) and QC works, and directly fetches the ratings for each player
and does the numerical seeding. This format displays less data in the seeding view.

## Planned features after 1.0

- [ ] Upload a .txt / .cvs / .pdf of player names and do seeding
- [ ] Generate visualization of brackets
- [ ] Create groups based on seeds
- [ ] Support 2v2 teams
- [ ] Support other games?

## Built with
- [Quake Champions](https://quake.bethesda.net/en)
- [Battlefy](https://battlefy.com)
- [Quake Stats](https://stats.quake.com)
- [Hapi](https://hapijs.com/)

## License
MIT