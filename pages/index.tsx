import type { NextPage } from 'next'
import { createElement, FC, useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid';

const Layout: FC<{ children: any }> = ({ children }) => {
  return (
    <div className="container mx-auto h-screen">
      <header className="h-1/4 border">
        Header, Layout1
      </header>
      <main className="mt-5 mb-5">
        {children}
      </main>
      <footer className="h-1/4 border">
        footer
      </footer>
    </div>
  )
}

// const Layout2: FC<{ children: any }> = ({ children }) => {
//   return (
//     <div>
//       <div>ala ma kota</div>
//       <div>
//         {children}
//       </div>
//     </div>
//   )
// }

const Container: FC<{ id: any, wrappers: any[], gap?: number }> = ({ id, wrappers, gap = 5 }) => {
  const [classes, setClasses] = useState('flex');
  const gaps: any = {
    1: 'gap-1',
    2: 'gap-2',
    3: 'gap-3',
    4: 'gap-4',
    5: 'gap-5',
  };
  useEffect(() => {
    if (gap) {
      setClasses(`flex ${gaps[gap]}`)
    }
  }, [gap])

  return (
    <div className={`flex ${gaps[gap]}`}>
      {
        wrappers.map((wrapper: any) => {
          return (<div key={uuidv4()}>{wrapper}</div>)
        })
      }
    </div>
  )
}

const Wrapper: FC<{ component: any }> = ({ component }) => {
  return (
    <div>
      {component}
    </div>
  )
}

const Button: FC<{}> = ({ }) => {
  return <button>asdas</button>
}

const DynamicCoponent: FC<{ComponentName: string}> = ({ComponentName}) => {
  switch(ComponentName) {
    case 'Button':
      return <Button />
  }
  return <ComponentName />
}

const Home: NextPage<{ ChoosenLayout: any }> = ({ ChoosenLayout }) => {
  let FinalLayout = Layout;
  switch (ChoosenLayout) {
    case 'Layout1':
      FinalLayout = Layout;
      break;
    case 'Layout2':
      // FinalLayout = Layout2;
      break;
  }
  return (
    <FinalLayout>
      <div className="flex flex-col">
        <div>
          <Container id="top-bar" wrappers={[]} />
        </div>
        <div className="flex">
          <div className="w-2/3 border">
            <Container id="left-column" gap={5} wrappers={[
              <Wrapper component={<DynamicCoponent ComponentName={'Button'} />} />,
              <Wrapper component={<Button />} />,
              <Wrapper component={<Button />} />
            ]} />
          </div>
          <div className="w-1/3 border">
            <Container id="side-bar" wrappers={[]} />
          </div>
        </div>
      </div>
    </FinalLayout>
  )
}

export async function getStaticProps(context: any) {
  const ChoosenLayout = 'Layout1';
  return {
    props: {
      ChoosenLayout: ChoosenLayout
    }, // will be passed to the page component as props
  }
}

export default Home
