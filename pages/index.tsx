import type { NextPage } from 'next'
import React, { cloneElement, Component, createElement, FC, ReactElement, ReactNode, ReactPortal, useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid';
import { AiOutlineTool } from 'react-icons/ai';

const transformComponents = (components: any[], setProp: any, getProp: any, propsProvider: any) => {
  let realComponents: any[] = [];
  components.map((component: any) => {
    if (component.component === 'Wrapper') {
      // console.log('tutaj', translatedPropsProvider(component.componentId));
      realComponents.push(<Wrapper componentId={component.componentId} setProp={setProp} getProp={getProp} propsProvider={propsProvider} {...propsProvider(component.componentId)} />);
    }
  })
  return realComponents;
}

const transformComponent = (component: any, setProp: any, getProp: any, propsProvider: any) => {
  if (component.component === 'Wrapper') {
    // console.log('tutaj', translatedPropsProvider(component.componentId));
    return <Wrapper componentId={component.componentId} setProp={setProp} getProp={getProp} propsProvider={propsProvider} {...propsProvider(component.componentId)} />;
  }
  if (component.component === 'Button') {
    // console.log('tutaj', translatedPropsProvider(component.componentId));
    return <Button {...propsProvider(component.componentId)} />;
  }
  if (component.component === 'Stats') {
    // console.log('tutaj', translatedPropsProvider(component.componentId));
    return <Stats {...propsProvider(component.componentId)} />;
  }
  return <div>NOT FOUND</div>
}

const FormFactory = (formComponent: any, componentId: any, setProp: any, getProp: any) => {
  if (formComponent === 'ButtonForm') {
    return <ButtonForm componentId={componentId} setProp={setProp} getProp={getProp} />
  }
  if (formComponent === 'StatsForm') {
    return <StatsForm componentId={componentId} setProp={setProp} getProp={getProp} />
  }
  return <div>NOT FOUND</div>
}

interface GeneralComponent {
  id: string,
}

const ContainerForm = ({ componentId, setProp, getProp }: { componentId: string, setProp: any, getProp: any }) => {
  return (
    <div className="space-y-3">
      <div className="form-control">
        <label className="label">
          <span className="label-text">Odstępy</span>
        </label>
        <select className="select select-bordered w-full" value={getProp(componentId, 'gap')} onChange={(ev) => {
          setProp(componentId, 'gap', ev.target.value)
        }}>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>
      </div>
      <div className="form-control">
        <label className="label">
          <span className="label-text">Kierunek</span>
        </label>
        <select className="select select-bordered w-full" value={getProp(componentId, 'direction')} onChange={(ev) => {
          setProp(componentId, 'direction', ev.target.value)
        }}>
          <option value="1">horyzontalny</option>
          <option value="2">wertykalny</option>
        </select>
      </div>
      <div className="form-control space-y-3">
        <label className="label">
          <span className="label-text">Komponenty</span>
        </label>
        <button onClick={() => {
          setProp(componentId, 'components', {
            component: 'Wrapper',
            componentId: 'wrapper1' // + (Math.random() * 100)
          })
        }} className="btn btn-block">Przycisk</button>
        <button onClick={() => {
          setProp(componentId, 'components', {
            component: 'Wrapper',
            componentId: 'wrapper3' // + (Math.random() * 100)
          })
        }} className="btn btn-block">Statystki</button>
      </div>
    </div>
  )
}

interface ContainerInteface {
  componentId: any,
  components: any[],
  getProp: any,
  setProp: any,
  propsProvider: any,
  gap?: number
  direction?: number
}
const Container = ({ componentId, components, getProp, setProp, propsProvider, gap = 5, direction = 1 }: ContainerInteface) => {
  const gaps: any = {
    1: 'gap-1',
    2: 'gap-2',
    3: 'gap-3',
    4: 'gap-4',
    5: 'gap-5',
  };
  const directions: any = {
    1: 'flex-row',
    2: 'flex-col',
  };

  return (
    <EditWrapper
      form={<ContainerForm componentId={componentId} setProp={setProp} getProp={getProp} />}
    >
      <div className={`flex flex-wrap ${gaps[gap]} ${directions[direction]}`}>
        {
          components.map((component: any) => {
            return (<div key={uuidv4()}>
              {transformComponent(component, setProp, getProp, propsProvider)}
            </div>)
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
          <label htmlFor="my-modal" onClick={() => { setIsOpen(false) }} className="btn">OK</label>
        </div>
      </div>
    </div>
  )
}

const EditWrapper = ({ children, form }: { children: any, form?: any }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="relative hover:pt-5">
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
    <div>
      <div className="form-control">
        <label className="label">
          <span className="label-text">Margines wewnętrzny</span>
        </label>
        <select className="select select-bordered w-full" value={getProp(componentId, 'padding')} onChange={(ev) => {
          setProp(componentId, 'padding', ev.target.value)
        }}>
          <option value="0">0</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </select>
      </div>
    </div>
  )
}

interface WrapperInterface extends GeneralComponent {
  componentId: string,
  component: any,
  componentForm: any,
  getProp: any,
  setProp: any,
  propsProvider: any,
  padding?: number,
}
const Wrapper = ({ componentId, component, componentForm, getProp, setProp, propsProvider, padding = 3 }: WrapperInterface) => {
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
      <div className={`${paddings[padding]}`}>
        {
          component && <EditWrapper
            form={FormFactory(component.form, component.componentId, setProp, getProp)}
          >
            {transformComponent(component, setProp, getProp, propsProvider)}
          </EditWrapper>
        }
      </div>
    </EditWrapper>
  )
}

interface PageComponentProps {
  text: string
}

const ButtonForm = ({ componentId, setProp, getProp }: { componentId: string, setProp: any, getProp: any }) => {
  return (
    <div>
      <div className="form-control">
        <label className="label">
          <span className="label-text">styl</span>
        </label>
        <select className="select select-bordered w-full" value={getProp(componentId, 'type')} onChange={(ev) => {
          setProp(componentId, 'type', ev.target.value)
        }}>
          <option value="standard">standard</option>
          <option value="primary">primary</option>
        </select>
      </div>
    </div>
  )
}

interface ButtonComponentInterface {
  type?: string
}

const Button = ({ text, type }: PageComponentProps & ButtonComponentInterface): ReactElement => {
  const [classes, setClasses] = useState('btn btn-block');
  useEffect(() => {
    switch (type) {
      case 'primary':
        setClasses('btn btn-block btn-primary');
        break;
      default:
        setClasses('btn btn-block');
    }
  }, [type])

  return <div className="flex items-center justify-center">
    <button className={`${classes}`}><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg> <span>{text}</span></button>
  </div>
}

const StatsForm = ({ componentId, setProp, getProp }: { componentId: string, setProp: any, getProp: any }) => {
  return <></>
}

const Stats = () => {
  return (
    <div className="stats shadow flex justify-center items-center">
      <div className="stat">
        <div className="stat-title">Bestseller!</div>
        <div className="stat-value">100.000</div>
        <div className="stat-desc">21% rynku</div>
      </div>
    </div>
  )
}

interface configurationProvider {
  children: ReactElement,
  config: object,
  configId: string,
};

const UseForm = (config: any) => {
  const [conf, setConf] = useState(config);
  const translatedPropsProvider = (configId: string) => {
    let realComponents: any[] = [];
    let config = propsProvider(configId);
    // if ('components' in config) {
    //   config.components.map((component: any)  => {
    //     if (component.component === 'Wrapper') {
    //       console.log('tutaj', translatedPropsProvider(component.componentId));
    //       realComponents.push(<Wrapper componentId={component.componentId} setProp={setProp} getProp={getProp} {...translatedPropsProvider(component.componentId)} />);
    //     }
    //   })
    // }
    // config.components = realComponents;
    return config;
  }
  const propsProvider = (configId: string) => {
    if (configId in conf) {
      return conf[configId];
    }
    return {}
  }
  const getConfig = () => {
    return conf;
  }
  const getProp = (id: string, key: string) => {
    if (id in conf) {
      return conf[id][key];
    }
    return null;
  }
  const setProp = (id: string, key: string, value: string) => {
    let ap = propsProvider(id);
    if (!ap) {
      ap[id] = {};
    }
    if (key in ap === false) {
      ap[key] = value;
    }
    setConf(
      Object.assign({}, conf, {
        [id]: {
          ...ap,
          [key]: Array.isArray(ap[key]) ? [...ap[key], value] : value
        }
      })
    );
  }

  return {
    translatedPropsProvider,
    propsProvider,
    getConfig,
    getProp,
    setProp
  }
}

const Home: NextPage<{ editable: any, config: any }> = ({ config }) => {
  const { getConfig, getProp, setProp, propsProvider, translatedPropsProvider } = UseForm(config);
  // config should be keep on state
  // config will be editable by forms
  return (
    <div className="container mx-auto h-screen bg-blue-500">
      <header className="h-1/4 border">
        Header, Layout1
      </header>
      <main className="">
        <div className="flex flex-col">
          <div>
            {/* <Container {...propsProvider('top-bar')} /> */}
          </div>
          {/* <DynamicContainer id="top-baner-coś-tam"></DynamicContainer> */}
          <div className="flex">
            <div className="w-2/3 border">
              <div className="p-3">
                <div className="alert alert-info">
                  <div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                    <span>Twój abonment wygasa za X dni, przedłuż już teraz!</span>
                  </div>
                </div>
              </div>
              <Container componentId={'main'} getProp={getProp} setProp={setProp} propsProvider={propsProvider} {...propsProvider('main')} />
            </div>
            <div className="w-1/3 border space-y-3">
              <div className="card m-5 bg-base-100 shadow-xl image-full">
                <figure><img src="https://placeimg.com/400/225/arch" alt="Shoes" /></figure>
                <div className="card-body">
                  <h2 className="card-title">Nowe Wydanie!</h2>
                  <p>Zoabcz co nowego!</p>
                  <div className="card-actions justify-end">
                    <button className="btn btn-primary">Sprawdź</button>
                  </div>
                </div>
              </div>
              <Container componentId={'sidebar'} getProp={getProp} setProp={setProp} propsProvider={propsProvider} {...propsProvider('sidebar')} />
              <div className="card card-compact m-5 bg-base-100 shadow-xl">
                <figure><img src="https://placeimg.com/400/225/arch" alt="Shoes" /></figure>
                <div className="card-body">
                  <h2 className="card-title">Przykładowe miejsce reklamy</h2>
                  <p>A co byś powiedział na...</p>
                </div>
              </div>
              <Container componentId={'sidebar1'} getProp={getProp} setProp={setProp} propsProvider={propsProvider} {...propsProvider('sidebar1')} />
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
    "main": {
      gap: 5,
      direction: 1,
      components: [],
    },
    "sidebar": {
      gap: 5,
      direction: 2,
      components: [
        {
          component: 'Wrapper',
          componentId: 'wrapper2'
        }
      ],
    },
    "sidebar1": {
      gap: 5,
      direction: 2,
      components: [],
    },
    wrapper1: {
      padding: 3,
      component: {
        component: 'Button',
        componentId: 'button1',
        form: 'ButtonForm'
      },
    },
    wrapper2: { // to powinno być tworzone dynamiczne?
      padding: 3,
      component: {
        component: 'Button',
        componentId: 'button2',
        form: 'ButtonForm'
      },
    },
    wrapper3: { // to powinno być tworzone dynamiczne?
      padding: 3,
      component: {
        component: 'Stats',
        componentId: 'stats2',
        form: 'StatsForm'
      },
    },
    button1: {
      text: 'Kupuje!',
      type: 'standard',
    },
    button2: {
      text: 'Subskrybuj',
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
