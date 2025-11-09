import Footer from './components/layout/Footer';
import Header from './components/layout/Header';
import Main from './components/layout/Main';

export default function App() {
  return (
    <div className="bg-background text-foreground flex min-h-svh flex-col">
      <Header />
      <Main>
        <section className="space-y-4 text-center">
          <h2 className="text-2xl font-semibold">Welcome to Gesture Drawing</h2>
          <p className="text-muted-foreground mx-auto max-w-md">
            Upload your reference images and start your timed sketch session.
          </p>
        </section>
      </Main>
      <Footer />
    </div>
  );
}
