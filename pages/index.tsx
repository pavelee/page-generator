import type { NextPage } from 'next'
import React, { cloneElement, Component, createElement, FC, ReactElement, ReactNode, ReactPortal, useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid';
import { AiOutlineTool } from 'react-icons/ai';

interface GeneralComponent {
  id: string,
}

interface ContainerInteface {
  wrappers: any[],
  gap?: number
}
const Container = ({ wrappers, gap = 5 }: ContainerInteface) => {
  const gaps: any = {
    1: 'gap-1',
    2: 'gap-2',
    3: 'gap-3',
    4: 'gap-4',
    5: 'gap-5',
  };

  return (
    <EditWrapper>
      <div className={`flex ${gaps[gap]}`}>
        {
          wrappers.map((wrapper: any) => {
            return (<div key={uuidv4()}>{wrapper}</div>)
          })
        }
      </div>
    </EditWrapper>
  )
}

const Modal = ({ isOpen = false, setIsOpen, children }: { isOpen: Boolean, setIsOpen: any, children: any }) => {
  return (
    <div className={`modal ` + (isOpen ? 'modal-open' : '')}>
      <div className="modal-box">
        {children}
        <div className="modal-action">
          <label htmlFor="my-modal" onClick={() => { setIsOpen(false) }} className="btn">close</label>
        </div>
      </div>
    </div>
  )
}

const EditWrapper = ({ children, form }: { children: any, form?: any }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="hover:outline hover:outline-1 relative hover:pt-5">
      <button className="btn-xs absolute top-0" onClick={() => { setIsOpen(!isOpen) }}><AiOutlineTool /></button>
      <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
        {form}
      </Modal>
      {children}
    </div>
  );
}

const WrapperForm = () => {
  const { config } = useConfig();
  const { getProp, setProp } = UseForm(config);
  return (
    <select value={getProp('wrapper1', 'padding')} onChange={(ev) => {
      setProp('wrapper1', 'padding', ev.target.value)
    }}>
      <option value="0">0</option>
      <option value="1">1</option>
      <option value="2">2</option>
      <option value="3">3</option>
    </select>
  )
}

interface WrapperInterface extends GeneralComponent {
  children: ReactElement<PageComponentProps>,
  padding?: number,
}
const Wrapper = ({ children, form, padding = 3 }: WrapperInterface) => {
  const paddings: any = {
    0: 'p-0',
    1: 'p-1',
    2: 'p-2',
    3: 'p-3',
  }
  return (
    <EditWrapper
      form={<WrapperForm />}
    >
      <div className={`border ${paddings[padding]}`}>
        <EditWrapper
          form={form}
        >
          {children}
        </EditWrapper>
      </div>
    </EditWrapper>
  )
}

interface PageComponentProps {
  name: string
}

interface Test123 {
  adsa: string
}

const Button = ({ name }: PageComponentProps): ReactElement => {
  return <div>
    <button>{name}</button>
    <a href="www.wip.pl">www.wip.pl</a>
  </div>
}

const Button1 = ({ adsa }: Test123): ReactElement => {
  return <div>asda</div>;
}

interface configurationProvider {
  children: ReactElement,
  config: object,
  configId: string,
};

const propsProvider = (config: { [key: string]: any }, configId: string) => {
  return config[configId];
}

const getConfigValue = (config: { [key: string]: any }, id: string, key: string) => {
  return config[id][key];
}

const UseForm = (config: any) => {
  const [conf, setConf] = useState(config);
  const getConfig = () => {
    return conf;
  }
  const getProp = (id: string, key: string) => {
    return conf[id][key];
  }
  const setProp = (id: string, key: string, value: string) => {
    setConf(
      Object.assign({}, conf, {
        [id]: {
          [key]: value
        }
      })
    );
  }

  return {
    getConfig,
    getProp,
    setProp
  }
}

const useConfig = () => {
  const config = { // config 
    'top-bar': {
      wrappers: []
    },
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
    wrapper1: {
      padding: 3
    },
    wrapper2: { // to powinno być tworzone dynamiczne?
      padding: 3
    },
    superComponentId: {
      type: 'component',
      name: 'SuperCookie',
      props: {

      }
    },
  };
  return { config }
}

const Home: NextPage<{ editable: any, config: any }> = ({ config }) => {
  const { getConfig, getProp, setProp } = UseForm(config);
  // config should be keep on state
  // config will be editable by forms
  return (
    <div className="container mx-auto h-screen bg-blue-500">
      <header className="h-1/4 border">
        Header, Layout1
      </header>
      <main className="mt-5 mb-5">
        <div className="flex flex-col">
          <div>
            <Container {...propsProvider(getConfig(), 'top-bar')} />
          </div>
          {/* <DynamicContainer id="top-baner-coś-tam"></DynamicContainer> */}
          <div className="flex">
            <div className="w-2/3 border">
              {/* <select value={getConfigValue(conf, 'wrapper1', 'padding')} onChange={(ev) => {
                setPadding('wrapper1', ev.target.value)
              }}>
                <option value="0">0</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
              </select>
              <select value={getConfigValue(conf, 'wrapper2', 'padding')} onChange={(ev) => {
                setPadding('wrapper2', ev.target.value)
              }}>
                <option value="0">0</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
              </select> */}
              <Container gap={5} wrappers={[
                <Wrapper {...propsProvider(getConfig(), 'wrapper1')} key={uuidv4()}>
                  <Button name={'test123'} />
                </Wrapper>,
                <Wrapper {...propsProvider(getConfig(), 'wrapper2')} key={uuidv4()}>
                  <Button1 adsa={'asdsa'} />
                </Wrapper>,
              ]} />
            </div>
            <div className="w-1/3 border">
              <Container wrappers={[]} />
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
  // prototype
  const config1 = {
    'top-bar': {
      wrappers: []
    },
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
    wrapper1: {
      padding: 3
    },
    wrapper2: { // to powinno być tworzone dynamiczne?
      padding: 3
    },
    superComponentId: {
      type: 'component',
      name: 'SuperCookie',
      props: {

      }
    },
  };
  const { config } = useConfig();
  return {
    props: {
      editable: false,
      config: config
    }, // will be passed to the page component as props
  }
}

export default Home
