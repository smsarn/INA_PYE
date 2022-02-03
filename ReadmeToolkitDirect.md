To release this:
- compile this project with buildMode 1 and copy to test-tkdirect (2 is for toolkitdirect, it also works for test but adfs loss takes you to production, which is ok)
- update APIs on test-tkdirect API
- compile landing page project feom "C:\Projects\PPIToolkitDirect\Toolkit Direct Main" with app mode 1


To release this in production toolkitdirect.ppi.ca: copy INA and apis from test, copy landing page as below
- compile this project with buildMode 2 and Copy from test-tkdirect "\\cal-dev-web0\test-tkdirectsnap\INA" folder. From there into production folder
- Copy from test-tkdirect "\\cal-dev-web0\test-tkdirectapi" folder into production folder
- compile landing page project feom "C:\Projects\PPIToolkitDirect\PPIToolkitDirect_Main - Copy" with app mode 2 and copy to "\\van-fileserver0\Release\ToolkitDirect\V1.0"
IMPORTANT: delete all the map files in build static folder