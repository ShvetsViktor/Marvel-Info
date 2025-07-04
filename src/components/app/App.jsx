import AppHeader from "../appHeader/AppHeader";

import { MainPage, ComicsPage, SingleComicPage, Page404 } from '../pages';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

const App = () => {

  return (
    <div className="app">
      <AppHeader />
      <main>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/comics" element={<ComicsPage />} />
          <Route path="/comics/:comicId" element={<SingleComicPage />} />
          <Route path="*" element={<Page404 />} />
        </Routes>
      </main>
    </div>
  )
}

export default App;
