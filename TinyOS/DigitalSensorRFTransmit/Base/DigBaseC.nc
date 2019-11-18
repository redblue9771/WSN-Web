configuration DigBaseC
{
}
implementation
{
	components DigBaseP as App;
	components MainC;

	App.Boot -> MainC.Boot;



	/* �����շ����*/
	components PlatformSerialC;
	App.UartStdControl -> PlatformSerialC;
	App.UartStream -> PlatformSerialC;

	/*���Ϣ���*/
    components new PlatformMacC(123);
	components AtosMacC;
	
	App.AtosControl -> AtosMacC;
	App.AMPacket -> PlatformMacC;
	App.Packet -> PlatformMacC;
	
	App.AMSend -> PlatformMacC;
	App.Receive ->PlatformMacC;
	
}
