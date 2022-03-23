import { Container } from 'reactstrap';
import { Menu } from '../Navbar';

export const Layout = ({ children }) => (
  <Container className="d-flex flex-column h-100">
      <Menu />
      <Container className="flex-grow-1 p-5 mx-auto">
        { children }
      </Container>
    <footer className="text-center font-monospace font-size-sm">
      Coded by <a target="_blank" href="https://github.com/bercoder">Bercoder</a>
    </footer>
  </Container>
)