import AppBar from '@material-ui/core/AppBar'
import Badge from '@material-ui/core/Badge'
import CircularProgress from '@material-ui/core/CircularProgress'
import green from '@material-ui/core/colors/green'
import Fab from '@material-ui/core/Fab'
import IconButton from '@material-ui/core/IconButton'
import LinearProgress from '@material-ui/core/LinearProgress'
import Link from '@material-ui/core/Link'
import { makeStyles, Toolbar } from '@material-ui/core'
import CheckIcon from '@material-ui/icons/Check'
import CopyrightIcon from '@material-ui/icons/Copyright'
import AccountDetailsIcon from '@material-ui/icons/Phonelink'
import clsx from 'clsx'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { useSnackbar } from 'notistack'

const useStyles = makeStyles((theme) => ({
  text: {
    padding: theme.spacing(2, 2, 0),
  },
  paper: {
    paddingBottom: 50,
  },
  list: {
    marginBottom: theme.spacing(2),
  },
  subheader: {
    backgroundColor: theme.palette.background.paper,
  },
  appBar: {
    top: 'auto',
    bottom: 0,
  },
  grow: {
    flexGrow: 1,
  },
  fabButton: {
    position: 'absolute',
    zIndex: 1,
    top: -30,
    left: 0,
    right: 0,
    margin: '0 auto',
  },
  buttonSuccess: {
    backgroundColor: green[500],
    '&:hover': {
      backgroundColor: green[700],
    },
  },
  fabProgress: {
    color: green[500],
    position: 'absolute',
    top: -6,
    left: -6,
  },
  buttonProgress: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
}))

function BottomBar({ socketStatus }) {
  const { setHumidity, setLight, setTemperature } = useContext(socketStatus)
  const [count, setCount] = useState(0)
  const classes = useStyles()

  const [url, setUrl] = useState('ws://localhost:8080/')
  const [loading, setLoading] = useState(false)
  const ws = useRef(WebSocket)

  const buttonClassname = clsx({
    [classes.buttonSuccess]: loading,
  })

  useEffect(() => {
    fetch('https://qqluqm.coding.io')
      .then((res) => res.json())
      .then((res) => setUrl(res.url))
  }, [])

  const { enqueueSnackbar } = useSnackbar()

  function connectHandle() {
    if (!loading) {
      ws.current[url] = new WebSocket(url)

      ws.current[url].onopen = () => {
        enqueueSnackbar('连接成功！', {
          variant: 'success',
        })
        setLoading(true)
      }

      ws.current[url].onclose = () => {
        enqueueSnackbar('连接已关闭！', {
          variant: 'info',
        })
        setLoading(false)
        setCount(0)
        setHumidity(0)
        setLight(0)
        setTemperature(0)
      }

      ws.current[url].onerror = () => {
        enqueueSnackbar('连接失败！请重试或刷新~', {
          variant: 'error',
        })
        setLoading(false)
      }

      ws.current[url].onmessage = (msg) => {
        switch (msg.data[0]) {
          case 'h':
            setTemperature(Number(msg.data.substr(1)))
            break
          case 's':
            setHumidity(Number(msg.data.substr(1)))
            break
          case 'c':
            setCount(Number(msg.data.substr(1)))
            break
          default:
            setLight(parseInt(msg.data.substr(1), 16))
        }
      }
    } else {
      ws.current[url].close()
    }
  }
  return (
    <AppBar position="fixed" color="primary" className={classes.appBar}>
      {loading && <LinearProgress color="secondary" />}
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="Open drawer">
          <Badge badgeContent={count} color="secondary">
            <AccountDetailsIcon />
          </Badge>
        </IconButton>
        <Fab className={classes.fabButton}>
          {!loading && <CircularProgress size={68} className={classes.fabProgress} />}
          <Fab color="secondary" className={buttonClassname} onClick={connectHandle}>
            {loading ? <CheckIcon /> : 'Start'}
          </Fab>
        </Fab>
        <div className={classes.grow} />
        <Link href="https://redblue.fun" color="inherit" target="_blank">
          <IconButton edge="end" color="inherit">
            <CopyrightIcon />
          </IconButton>
        </Link>
      </Toolbar>
    </AppBar>
  )
}

export default BottomBar
