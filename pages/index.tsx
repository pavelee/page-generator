import type { NextPage } from 'next'
import React, { Component, createElement, FC, ReactElement, ReactNode, ReactPortal, useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid';

interface GeneralComponent {
  id: string,
}

interface ContainerInteface {
  id: any,
  wrappers: any[],
  gap?: number
}
const Container = ({ id, wrappers, gap = 5 }: ContainerInteface) => {
  const gaps: any = {
    1: 'gap-1',
    2: 'gap-2',
    3: 'gap-3',
    4: 'gap-4',
    5: 'gap-5',
  };

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
interface WrapperInterface extends GeneralComponent {
  children: ReactElement<PageComponentProps>,
  padding?: number,
}
const Wrapper = ({ children, padding = 0 }: WrapperInterface) => {
  const paddings: any = {
    0: 'p-0',
    1: 'p-1',
    2: 'p-2',
    3: 'p-3',
  }
  return (
    <div className={`border ${paddings[padding]}`}>
      {children}
    </div>
  )
}
interface PageComponentProps {
  name: string
}

interface Test123 {
  adsa: string
}

const Button = ({ name }: PageComponentProps): ReactElement => {
  return <button>{name}</button>
}

const Button1 = ({ adsa }: Test123): ReactElement => {
  return <div>asda</div>;
}

const Home: NextPage<{ ChoosenLayout: any, config: any }> = ({ ChoosenLayout, config }) => {
  // config should be keep on state
  // config will be editable by forms
  return (
    <div className={`container mx-auto h-screen bg-blue-500`}>
      <header className="h-1/4 border">
        Header, Layout1
      </header>
      <main className="mt-5 mb-5">
        <div className="flex flex-col">
          <div>
            <Container id="top-bar" wrappers={[]} />
          </div>
          {/* <DynamicContainer id="top-baner-coś-tam"></DynamicContainer> */}
          <div className="flex">
            <div className="w-2/3 border">
              <Container id="left-column" gap={5} wrappers={[
                <Wrapper id="wrapper1" key={uuidv4()} padding={3}>
                  <Button name={'test123'} />
                </Wrapper>,
                <Wrapper id="wrapper2" key={uuidv4()}>
                  <Button1 adsa={'asdsa'} />
                </Wrapper>,
                // <Wrapper Component={<Button />} />,
                // <Wrapper Component={<Button />} />
              ]} />
            </div>
            <div className="w-1/3 border">
              <Container id="side-bar" wrappers={[]} />
            </div>
          </div>
        </div>
      </main>
      <footer className="h-1/4 border">
        footer
      </footer>
    </div>
  )
}

export async function getStaticProps(context: any) {
  const ChoosenLayout = 'Layout1';
  // prototype
  const config = {
    finalLayout: {
      type: 'layout',
      props: {
        name: 'Layout1',
        classes: 'bg-blue-500 p-5'
      }
    },
    "idComponentu": {
      type: 'container',
      props: {
        wrappers: [
          'wrapperId'
        ],
      },
    },
    wrapperId: {
      type: 'wrapper',
      props: {
        padding: 'asda',
        component: 'superComponentId',
      }
    },
    superComponentId: {
      type: 'component',
      name: 'SuperCookie',
      props: {

      }
    },
  };
  return {
    props: {
      ChoosenLayout: ChoosenLayout,
      config: config
    }, // will be passed to the page component as props
  }
}

export default Home
