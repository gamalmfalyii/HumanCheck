# Realcheck

> AI-generated resume detector powered by Claude. Paste any resume and get an authenticity score, signal breakdown, and plain-language verdict in seconds.

![Realcheck screenshot](assets/screenshot.png)

## Download

Head to [Releases](../../releases/latest) and grab the installer for your platform:

| Platform | File |
|----------|------|
| Windows  | `Realcheck-Setup-x.x.x.exe` |
| macOS    | `Realcheck-x.x.x.dmg` |
| Linux    | `Realcheck-x.x.x.AppImage` |

No build steps needed — just download and install.

## First launch

On first launch, Realcheck will ask for your **Anthropic API key**. You can get one free at [console.anthropic.com](https://console.anthropic.com). Your key is stored locally on your machine and never sent anywhere other than the Anthropic API.

## Usage

1. Paste resume text into the left panel
2. Hit **Analyze →**
3. Review the score, signal breakdown, and summary in the right panel

## Scores

| Score | Verdict |
|-------|---------|
| 0–34% | Likely human-written |
| 35–64% | Mixed signals |
| 65–100% | Likely AI-generated |

## Development

```bash
# Clone the repo
git clone https://github.com/yourusername/realcheck.git
cd realcheck

# Install dependencies
npm install

# Run in dev mode
npm start
```

## Releasing a new version

Releases are built automatically by GitHub Actions whenever you push a version tag:

```bash
# Bump version in package.json first, then:
git add package.json
git commit -m "chore: bump version to v1.0.1"
git tag v1.0.1
git push && git push --tags
```

GitHub Actions will build Windows (.exe), macOS (.dmg), and Linux (.AppImage) installers and attach them to a new GitHub Release automatically. No manual steps needed.

## Tech stack

- [Electron](https://www.electronjs.org/) — cross-platform desktop shell
- [Claude API](https://www.anthropic.com/) — resume analysis via `claude-sonnet-4-6`
- Vanilla HTML/CSS/JS — zero frontend dependencies

## License

MIT © Gamal Aly
