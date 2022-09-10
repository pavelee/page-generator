import type { NextPage } from 'next'
import React, { Component, createElement, FC, ReactElement, ReactNode, ReactPortal, useEffect, useState } from 'react'
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

// const isPageComponent = (arg: any): arg is PageComponent<PageComponentProps, any> => {
//   console.log(typeof(arg.props));
//   return arg && typeof(arg.props) == 'object' as string;
// }
interface WrapperInterface {
  component: PageComponent
}
const Wrapper = ({ component }: WrapperInterface) => {
  // if (isPageComponent(component)) {
  //   console.log('component: ');
  // } else {
  //   throw Error('test');
  // }
  return (
    <div>
      {component}
    </div>
  )
}

interface PageComponent extends ReactElement { }
interface PageComponentProps {
  name: string
}

interface Test123 {
  adsa: string
}

const Button = ({ name }: PageComponentProps): PageComponent => {
  return <button>{name}</button>
}

const Button1 = ({ adsa }: Test123): ReactElement => {
  return <div>asda</div>;
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
              <Wrapper key={uuidv4()} component={<Button name={'test123'} />} />,
              <Wrapper key={uuidv4()} component={<Button1 adsa={'asdsa'} />} />,
              // <Wrapper Component={<Button />} />,
              // <Wrapper Component={<Button />} />
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
  // prototype
  const config = {
    "layout": {
      "name": "Layout1",
      "containers": {
        "left-column": [
          {
            "props": {},
            "component": {
              "name": "x",
              "props": {}
            }
          }
        ]
      }
    }
  };
  return {
    props: {
      ChoosenLayout: ChoosenLayout
    }, // will be passed to the page component as props
  }
}

export default Home
