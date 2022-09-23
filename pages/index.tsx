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
    <div className="hover:outline hover:outline-1 relative pt-5">
      <button className="btn-xs absolute top-0" onClick={() => { setIsOpen(!isOpen) }}><AiOutlineTool /></button>
      <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
        {form}
      </Modal>
      {children}
    </div>
  );
}

const WrapperForm = ({ componentId, setProp, getProp }: { componentId: string, setProp: any, getProp: any }) => {
  return (
    <select value={getProp(componentId, 'padding')} onChange={(ev) => {
      setProp(componentId, 'padding', ev.target.value)
    }}>
      <option value="0">0</option>
      <option value="1">1</option>
      <option value="2">2</option>
      <option value="3">3</option>
    </select>
  )
}

interface WrapperInterface extends GeneralComponent {
  componentId: string,
  children: ReactElement<PageComponentProps>,
  childrenForm: any,
  getProp: any,
  setProp: any,
  padding?: number,
}
const Wrapper = ({ componentId, children, getProp, setProp, childrenForm, padding = 3 }: WrapperInterface) => {
  const paddings: any = {
    0: 'p-0',
    1: 'p-1',
    2: 'p-2',
    3: 'p-3',
  }
  return (
    <EditWrapper
      form={<WrapperForm componentId={componentId} getProp={getProp} setProp={setProp} />}
    >
      <div className={`border ${paddings[padding]}`}>
        <EditWrapper
          form={childrenForm}
        >
          {children}
        </EditWrapper>
      </div>
    </EditWrapper>
  )
}

interface PageComponentProps {
  text: string
}

const ButtonForm = ({ componentId, setProp, getProp }: { componentId: string, setProp: any, getProp: any }) => {
  return (
    <select value={getProp(componentId, 'type')} onChange={(ev) => {
      setProp(componentId, 'type', ev.target.value)
    }}>
      <option value="standard">standard</option>
      <option value="primary">primary</option>
    </select>
  )
}

interface ButtonComponentInterface {
  type?: string
}

const Button = ({ text, type }: PageComponentProps & ButtonComponentInterface): ReactElement => {
  const [classes, setClasses] = useState('btn');
  useEffect(() => {
    switch (type) {
      case 'primary':
        setClasses('btn btn-primary');
        break;
      default:
        setClasses('btn');
    }
  }, [type])

  return <button className={`${classes}`}>{text}</button>
}

interface configurationProvider {
  children: ReactElement,
  config: object,
  configId: string,
};

const UseForm = (config: any) => {
  const [conf, setConf] = useState(config);
  const propsProvider = (configId: string) => {
    return conf[configId];
  }
  const getConfig = () => {
    return conf;
  }
  const getProp = (id: string, key: string) => {
    return conf[id][key];
  }
  const setProp = (id: string, key: string, value: string) => {
    let ap = propsProvider(id);
    setConf(
      Object.assign({}, conf, {
        [id]: {
          ...ap,
          [key]: value
        }
      })
    );
  }

  return {
    propsProvider,
    getConfig,
    getProp,
    setProp
  }
}

const Home: NextPage<{ editable: any, config: any }> = ({ config }) => {
  const { getConfig, getProp, setProp, propsProvider } = UseForm(config);
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
            <Container {...propsProvider('top-bar')} />
          </div>
          {/* <DynamicContainer id="top-baner-coś-tam"></DynamicContainer> */}
          <div className="flex">
            <div className="w-2/3 border">
              <Container gap={5} wrappers={[
                <Wrapper
                  componentId={'wrapper1'}
                  childrenForm={
                    <ButtonForm setProp={setProp} getProp={getProp} componentId={'button1'} />
                  }
                  getProp={getProp}
                  setProp={setProp}
                  {...propsProvider('wrapper1')}
                  key={uuidv4()}>
                  <Button {...propsProvider('button1')}
                  />
                </Wrapper>,
                <Wrapper
                  componentId={'wrapper2'}
                  childrenForm={
                    <ButtonForm setProp={setProp} getProp={getProp} componentId={'button2'} />
                  }
                  getProp={getProp}
                  setProp={setProp}
                  {...propsProvider('wrapper2')}
                  key={uuidv4()}
                >
                  <Button {...propsProvider('button2')} />
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
    button1: {
      text: 'ala ma kota',
      type: 'standard',
    },
    button2: {
      text: 'PROMOCJA',
      type: 'standard'
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


export async function getStaticProps(context: any) {
  // prototype
  const { config } = useConfig();
  return {
    props: {
      editable: false,
      config: config
    }, // will be passed to the page component as props
  }
}

export default Home
