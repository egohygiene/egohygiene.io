import { tokens } from "@egohygiene/design-tokens";
import { ThemeProvider } from "@egohygiene/themes";
import {
  Button,
  Card,
  Cluster,
  Container,
  Spinner,
  StatusBadge,
  ThemeToggle,
} from "@egohygiene/ui";
import { OrbitVisualization } from "@egohygiene/visualizations";

export function App() {
  return (
    <ThemeProvider>
      <Container>
        <main className="playground-stack">
          <header className="playground-header">
            <div>
              <h1>Playground</h1>
              <p>
                Shared UI components, theme controls, token previews, and a visualization smoke
                surface.
              </p>
            </div>
            <ThemeToggle />
          </header>
          <section className="playground-grid">
            <Card>
              <h2>Buttons</h2>
              <Cluster>
                <Button>Primary</Button>
                <Button tone="secondary">Secondary</Button>
                <Button tone="ghost">Ghost</Button>
              </Cluster>
            </Card>
            <Card>
              <h2>Feedback</h2>
              <Cluster>
                <Spinner />
                <StatusBadge tone="available">available</StatusBadge>
                <StatusBadge tone="development">development</StatusBadge>
                <StatusBadge tone="planned">planned</StatusBadge>
              </Cluster>
            </Card>
            <Card>
              <h2>Token preview</h2>
              <pre>{JSON.stringify(tokens.spacing, null, 2)}</pre>
            </Card>
            <Card>
              <h2>Visualization</h2>
              <OrbitVisualization size={180} />
            </Card>
          </section>
        </main>
      </Container>
    </ThemeProvider>
  );
}
