import { Routes, Route } from 'react-router-dom'

import App from '../App'
import Dashboard from '../pages/Dashboard'
import Markdown from '../pages/Markdown'
import List from '../pages/List'
// import Kanban from '../pages/Kanban'
// import StarredPage from '../pages/StarredPage'
// import TrashPage from '../pages/TrashPage'

import AppLayout from '../layouts/AppLayout'

const AppRoutes = () => {
  return (
    <Routes>
      {/* Landing page WITHOUT sidebar */}
      <Route path="/" element={<App />} />

      {/* Pages WITH sidebar */}
      <Route element={<AppLayout />}>
        <Route path="/pages" element={<Dashboard />} />
        <Route path="/editor/plain-text" element={<Markdown />} />

        <Route path="/editor/list" element={<List />} />

        {/* <Route path="/editor/kanban" element={<Kanban />} /> */}
        {/* <Route path="/starred" element={<StarredPage />} />  */}
         {/* <Route path="/trash" element={<TrashPage />} />  */}
      </Route>
    </Routes>
  )
}

export default AppRoutes